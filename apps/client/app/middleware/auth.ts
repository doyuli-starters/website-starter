export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, user, fetchProfile } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (!user.value) {
    const profile = await fetchProfile()
    if (!profile) {
      return navigateTo('/login')
    }
  }
})
