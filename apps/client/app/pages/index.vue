<script setup lang="ts">
import { Calendar, Check, Copy, KeyRound, LogOut, Mail, Moon, Shield, Sun, User } from '@lucide/vue'
import { useClipboard, useDark, useDateFormat, useToggle } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

definePageMeta({
  middleware: 'auth',
})

const { user, loading, logout } = useAuth()
const { copy, copied } = useClipboard({ copiedDuring: 2000 })

const isDark = useDark()
const toggleDark = useToggle(isDark)

function handleCopyId() {
  if (!user.value?.id) {
    return
  }
  copy(user.value.id)
  toast.success('用户 ID 已复制')
}

function handleLogout() {
  logout()
  toast.info('已安全退出登录')
}

function formatDate(dateStr?: string) {
  if (!dateStr) {
    return '未知时间'
  }
  return useDateFormat(dateStr, 'YYYY-MM-DD HH:mm').value
}

const userInitial = computed(() => {
  if (!user.value) {
    return 'U'
  }
  return (user.value.name || user.value.email || 'U').charAt(0).toUpperCase()
})
</script>

<template>
  <main class="relative flex min-h-svh w-full items-center justify-center bg-background p-4 text-foreground">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-muted/40 via-background to-background" />
    <div class="absolute right-4 top-4">
      <Button
        variant="ghost"
        size="icon-sm"
        class="rounded-full text-muted-foreground transition-colors hover:text-foreground"
        :title="isDark ? '切换至亮色模式' : '切换至暗色模式'"
        @click="toggleDark()"
      >
        <Sun v-if="isDark" class="size-4" />
        <Moon v-else class="size-4" />
      </Button>
    </div>

    <Card class="w-full max-w-md border-border/70 bg-card/80 shadow-2xl shadow-foreground/3 backdrop-blur-sm">
      <CardHeader class="flex flex-col items-center pb-4 text-center">
        <div class="relative mb-3 flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground shadow-sm">
          {{ userInitial }}
          <span
            class="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-background bg-emerald-500"
            title="在线"
          />
        </div>

        <CardTitle class="text-xl font-semibold tracking-tight">
          {{ user?.name || '个人主页' }}
        </CardTitle>
        <CardDescription class="mt-0.5 text-xs text-muted-foreground">
          {{ user?.email }}
        </CardDescription>

        <div class="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <Shield class="size-3 text-primary" />
          {{ user?.role || 'user' }}
        </div>
      </CardHeader>

      <Separator class="opacity-60" />

      <CardContent class="space-y-3 py-5 text-sm">
        <div class="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-xs">
          <span class="flex items-center gap-2 text-muted-foreground">
            <KeyRound class="size-3.5" />
            用户 ID
          </span>
          <button
            type="button"
            class="group inline-flex items-center gap-1.5 font-mono text-foreground transition-colors hover:text-primary"
            @click="handleCopyId"
          >
            <span class="max-w-40 truncate sm:max-w-50">{{ user?.id }}</span>
            <Check v-if="copied" class="size-3 text-emerald-500" />
            <Copy v-else class="size-3 text-muted-foreground group-hover:text-primary" />
          </button>
        </div>

        <div class="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-xs">
          <span class="flex items-center gap-2 text-muted-foreground">
            <Mail class="size-3.5" />
            绑定邮箱
          </span>
          <span class="font-medium text-foreground">{{ user?.email }}</span>
        </div>

        <div class="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-xs">
          <span class="flex items-center gap-2 text-muted-foreground">
            <User class="size-3.5" />
            账户昵称
          </span>
          <span class="font-medium text-foreground">{{ user?.name || '未设置' }}</span>
        </div>

        <div class="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-xs">
          <span class="flex items-center gap-2 text-muted-foreground">
            <Calendar class="size-3.5" />
            注册时间
          </span>
          <span class="font-medium text-muted-foreground">{{ formatDate(user?.createdAt) }}</span>
        </div>
      </CardContent>

      <Separator class="opacity-60" />

      <CardFooter class="pt-4">
        <Button
          variant="outline"
          class="w-full gap-2 border-border/80 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          :disabled="loading"
          @click="handleLogout"
        >
          <LogOut class="size-3.5" />
          退出登录
        </Button>
      </CardFooter>
    </Card>
  </main>
</template>
