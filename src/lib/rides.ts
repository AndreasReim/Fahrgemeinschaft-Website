import { supabase } from './supabase'
import type { Ride, RideSearchFilters, RideWithDriver } from '../types/database'

const rideSelect = `
  *,
  profiles ( display_name, phone )
`

export async function searchRides(filters: RideSearchFilters): Promise<{
  data: RideWithDriver[]
  error: string | null
}> {
  let query = supabase
    .from('rides')
    .select(rideSelect)
    .gte('departure_at', new Date().toISOString())
    .order('departure_at', { ascending: true })

  if (filters.origin?.trim()) {
    query = query.ilike('origin', `%${filters.origin.trim()}%`)
  }
  if (filters.destination?.trim()) {
    query = query.ilike('destination', `%${filters.destination.trim()}%`)
  }
  if (filters.dateFrom) {
    query = query.gte('departure_at', `${filters.dateFrom}T00:00:00`)
  }
  if (filters.dateTo) {
    query = query.lte('departure_at', `${filters.dateTo}T23:59:59`)
  }

  const { data, error } = await query
  const sorted = ((data as RideWithDriver[]) ?? []).sort(
    (a, b) => new Date(a.departure_at).getTime() - new Date(b.departure_at).getTime(),
  )
  return { data: sorted, error: error?.message ?? null }
}

export async function getMyRides(driverId: string): Promise<{
  data: Ride[]
  error: string | null
}> {
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .eq('driver_id', driverId)
    .order('departure_at', { ascending: true })

  return { data: data ?? [], error: error?.message ?? null }
}

export async function createRide(
  ride: Omit<Ride, 'id' | 'created_at'>,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('rides').insert(ride)
  return { error: error?.message ?? null }
}

export async function getRideById(id: string): Promise<{
  data: Ride | null
  error: string | null
}> {
  const { data, error } = await supabase.from('rides').select('*').eq('id', id).maybeSingle()
  return { data, error: error?.message ?? null }
}

export async function updateRide(
  id: string,
  updates: Pick<Ride, 'origin' | 'destination' | 'departure_at' | 'seats_available' | 'description'>,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('rides').update(updates).eq('id', id)
  return { error: error?.message ?? null }
}

export async function deleteRide(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('rides').delete().eq('id', id)
  return { error: error?.message ?? null }
}
