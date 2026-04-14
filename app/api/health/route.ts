import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';
import * as Sentry from "@sentry/nextjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  const start = Date.now();
  const report = {
    status: '🌕 만월(Healthy)',
    timestamp: new Date().toISOString(),
    latency: '',
    checks: { database: '⌛ 진맥 중', cloudinary: '⌛ 진맥 중' }
  };

  try {
    // 🔍 [DB 진맥]
    const { error: dbError } = await supabase.from('temples').select('id').limit(1);
    report.checks.database = dbError ? '🌑 막힘(Error)' : '🌕 통함(OK)';

    // 🔍 [Cloudinary 진맥]
    const cloudinaryRes = await cloudinary.api.ping();
    report.checks.cloudinary = cloudinaryRes.status === 'ok' ? '🌕 통함(OK)' : '🌑 막힘(Error)';

    const isHealthy = !dbError && cloudinaryRes.status === 'ok';
    report.status = isHealthy ? '🌕 만월(Healthy)' : '🌘 하현(Unhealthy)';
    report.latency = `${Date.now() - start}ms`;

    return NextResponse.json(report, { status: isHealthy ? 200 : 500 });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ status: '🌑 개기월식(Critical)', error: String(error) }, { status: 500 });
  }
}
