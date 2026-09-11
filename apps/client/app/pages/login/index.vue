<script setup lang="ts">
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Moon,
  ShieldCheck,
  Sun,
} from '@lucide/vue'
import { useDark, useToggle } from '@vueuse/core'
import { loginSchema } from '@website-starter/shared'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const { login, isAuthenticated } = useAuth()

if (isAuthenticated.value) {
  navigateTo('/')
}

const form = reactive({
  email: '',
  password: '',
})

const isSubmitting = ref(false)
const [showPassword, togglePassword] = useToggle(false)

const isDark = useDark()
const toggleDark = useToggle(isDark)

async function handleSubmit() {
  const result = loginSchema.safeParse(form)
  if (!result.success) {
    const firstIssue = result.error.issues[0]
    toast.error(firstIssue?.message || '请输入有效的邮箱和密码')
    return
  }

  isSubmitting.value = true
  try {
    const promise = login(result.data)
    toast.promise(promise, {
      loading: '正在验证身份...',
      success: async () => {
        await navigateTo('/')
        return '登录成功，欢迎回来'
      },
      error: (error: any) => error?.data?.message || error?.message || '邮箱或密码错误',
    })
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="relative flex min-h-svh w-full items-center justify-center bg-background px-4 py-12 text-foreground">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-muted/50 via-background to-background" />

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

    <Card class="w-full max-w-sm border-border/70 shadow-xl shadow-foreground/2">
      <CardHeader class="space-y-2 pb-6 text-center">
        <div class="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck class="size-6" />
        </div>
        <CardTitle class="text-xl font-semibold tracking-tight">
          登录账号
        </CardTitle>
        <CardDescription class="text-xs text-muted-foreground">
          输入注册邮箱与密码以访问控制台
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="email" class="text-xs font-medium">邮箱地址</Label>
            <div class="relative">
              <Mail class="absolute left-3 top-2.5 size-4 text-muted-foreground/70" />
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="name@example.com"
                class="pl-9 text-sm"
                autocomplete="email"
                :disabled="isSubmitting"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="password" class="text-xs font-medium">密码</Label>
            </div>
            <div class="relative">
              <Lock class="absolute left-3 top-2.5 size-4 text-muted-foreground/70" />
              <Input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="pl-9 pr-9 text-sm"
                autocomplete="current-password"
                :disabled="isSubmitting"
                required
              />
              <button
                type="button"
                tabindex="-1"
                class="absolute right-3 top-2.5 text-muted-foreground/70 transition-colors hover:text-foreground"
                @click="togglePassword()"
              >
                <EyeOff v-if="showPassword" class="size-4" />
                <Eye v-else class="size-4" />
              </button>
            </div>
          </div>

          <Button
            type="submit"
            class="w-full font-medium"
            :disabled="isSubmitting"
          >
            <Loader2 v-if="isSubmitting" class="mr-2 size-4 animate-spin" />
            <span v-else class="flex items-center gap-1.5">
              立即登录
              <ArrowRight class="size-3.5" />
            </span>
          </Button>
        </form>
      </CardContent>
    </Card>
  </main>
</template>
