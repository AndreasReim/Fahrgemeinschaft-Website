import { supabase } from './supabase'

export async function updateProfile(
  userId: string,
  displayName: string,
  phone: string | null,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName.trim(),
      phone: phone?.trim() || null,
    })
    .eq('id', userId)

  return { error: error?.message ?? null }
}
