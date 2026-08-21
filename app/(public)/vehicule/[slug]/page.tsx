import React from 'react';
import VehicleDetailClient from '@/components/VehicleDetailContent';
import cleanVehiclesDataset from '@/data/yescapa-vehicles.json';

export async function generateStaticParams() {
  return cleanVehiclesDataset.map((vehicle) => ({
    slug: vehicle.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <VehicleDetailClient slug={slug} />;
}
