export interface Profile {
  id: string
  display_name: string
  phone: string | null
  created_at: string
}

export interface Ride {
  id: string
  driver_id: string
  origin: string
  destination: string
  departure_at: string
  seats_available: number
  description: string | null
  created_at: string
}

export interface RideWithDriver extends Ride {
  profiles: Pick<Profile, 'display_name' | 'phone'> | null
}

export interface RideSearchFilters {
  origin?: string
  destination?: string
  dateFrom?: string
  dateTo?: string
}
