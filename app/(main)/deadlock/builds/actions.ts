'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { UpgradeItemV2 } from '@/lib/deadlock-api'

export async function createBuild(data: {
  hero_id: number;
  name: string;
  description: string;
  items: Record<string, UpgradeItemV2[]>;
  published: boolean;
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    console.error('createBuild Auth Error:', authError || 'No user found')
    return { error: 'Unauthorized' }
  }

  const { data: build, error } = await supabase
    .from('builds')
    .insert({
      user_id: user.id,
      hero_id: data.hero_id,
      name: data.name,
      description: data.description,
      items: data.items,
      published: data.published,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating build:', error?.message || error)
    return { error: error.message }
  }

  revalidatePath('/deadlock/builds')
  return { build }
}

export async function fetchBuilds() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('builds')
    .select('*, author:profiles!builds_user_id_fkey(id, username, full_name, avatar_url)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching builds:', error?.message || error)
    return []
  }

  return data
}

export async function getBuild(id: string) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('builds')
    .select('*, author:profiles!builds_user_id_fkey(id, username, full_name, avatar_url)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching build:', error)
    return null
  }

  return data
}

export async function updateBuild(id: string, data: {
  hero_id: number;
  name: string;
  description: string;
  items: Record<string, UpgradeItemV2[]>;
  published: boolean;
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  const { data: build, error } = await supabase
    .from('builds')
    .update({
      hero_id: data.hero_id,
      name: data.name,
      description: data.description,
      items: data.items,
      published: data.published,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating build:', error)
    return { error: error.message }
  }

  revalidatePath('/deadlock/builds')
  revalidatePath(`/deadlock/builds/${id}`)
  return { build }
}

export async function toggleLike(buildId: string, isLiked: boolean) {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Unauthorized' }

  if (isLiked) {
    const { error } = await supabase
      .from('build_likes')
      .delete()
      .eq('build_id', buildId)
      .eq('user_id', user.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('build_likes')
      .insert({ build_id: buildId, user_id: user.id })
    if (error) return { error: error.message }
  }

  revalidatePath(`/deadlock/builds/${buildId}`)
  return { success: true }
}

export async function getLikesCount(buildId: string) {
  const supabase = await createSupabaseServerClient()
  const { count, error } = await supabase
    .from('build_likes')
    .select('*', { count: 'exact', head: true })
    .eq('build_id', buildId)
  if (error) return 0
  return count || 0
}

export async function hasUserLiked(buildId: string) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('build_likes')
    .select('*')
    .eq('build_id', buildId)
    .eq('user_id', user.id)
    .single()

  return !!data && !error
}

export async function postComment(buildId: string, content: string) {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('build_comments')
    .insert({
      build_id: buildId,
      user_id: user.id,
      content
    })

  if (error) return { error: error.message }
  revalidatePath(`/deadlock/builds/${buildId}`)
  return { success: true }
}

export async function fetchComments(buildId: string) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('build_comments')
    .select('*, author:profiles!build_comments_user_id_fkey(id, username, full_name, avatar_url)')
    .eq('build_id', buildId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }
  return data
}