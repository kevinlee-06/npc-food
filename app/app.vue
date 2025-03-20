<script setup lang="ts">
import { breakpointsSematic } from '@vueuse/core'
import IconClose from '~icons/mingcute/close-fill'
import IconDiscord from '~icons/mingcute/discord-fill'
import IconGitHub from '~icons/mingcute/github-fill'
import IconMenu from '~icons/mingcute/menu-fill'
import IconMoon from '~icons/mingcute/moon-fill'

useHead({
  title: '北科程式設計研究社',
  link: [
    { rel: 'manifest', href: '/manifest.webmanifest' },
    { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
    { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
  ],
})

// const autoScroll = useCookie('auto-scroll', {
//   default: () => true,
//   watch: true,
// })

const isDark = useDark()
const toggleDark = useToggle(isDark)

const routes = {
  '/': '北科美食地圖',
  '/contribute': '貢獻',
}

const breakpoints = useBreakpoints(breakpointsSematic)
const isMobile = breakpoints.smaller('tablet')

const [mobileMenuOpen, toggleMobileMenu] = useToggle(false)
</script>

<template>
  <meta
    content="width=device-width, initial-scale=1.0"
    name="viewport"
  >
  <NuxtRouteAnnouncer />

  <header
    id="header"
    class="flex justify-between items-center h-16 p-4 bg-zinc-800 dark:bg-zinc-900"
  >
    <div class="left flex-2">
      <a href="/">
        <img
          class="h-8"
          src="assets/img/npc-horizontal.svg"
        >
      </a>
    </div>

    <template v-if="isMobile">
      <div class="right">
        <ul class="flex gap-2">
          <li>
            <button
              class="text-white"
              @click="toggleMobileMenu()"
            >
              <IconClose v-if="mobileMenuOpen" />
              <IconMenu v-else />
            </button>
          </li>
        </ul>
      </div>
    </template>

    <template v-else>
      <nav class="center flex flex-1 justify-center">
        <ul class="flex gap-4">
          <li
            v-for="(route, path) in routes"
            :key="path"
          >
            <NuxtLink
              class="text-white hover:underline"
              :to="path"
            >
              {{ route }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="right flex flex-2 gap-2 justify-end">
        <ul class="flex gap-2">
          <li>
            <a
              class="text-white"
              href="https://to.ntut.club/discord"
              target="_blank"
            ><IconDiscord /></a>
          </li>
          <li>
            <a
              class="text-white"
              href="https://github.com/kevinlee-06/npc-food"
              target="_blank"
            ><IconGitHub /></a>
          </li>
          <li>
            <button
              class="text-white"
              @click="toggleDark()"
            >
              <IconMoon />
            </button>
          </li>
        </ul>
      </div>
    </template>
  </header>

  <Transition name="menu">
    <menu
      v-if="mobileMenuOpen"
      id="header-mobile-menu"
      class="absolute inset-x-0 top-16 flex flex-col p-6 gap-4 bg-zinc-800 dark:bg-zinc-900 text-white transition-all duration-400"
    >
      <li
        v-for="(name, path) in routes"
        :key="path"
      >
        <NuxtLink
          class="mobile-menu-route flex items-center gap-2 p-2 hover:bg-zinc-700 dark:hover:bg-zinc-600"
          :to="path"
          @click="toggleMobileMenu()"
        >
          {{ name }}
        </NuxtLink>
      </li>
      <div class="border-t border-zinc-600" />
      <li>
        <a
          class="flex items-center gap-2 p-2 hover:bg-zinc-700 dark:hover:bg-zinc-600"
          href="https://to.ntut.club/discord"
          target="_blank"
        ><IconDiscord />Discord</a>
      </li>
      <li>
        <a
          class="flex items-center gap-2 p-2 hover:bg-zinc-700 dark:hover:bg-zinc-600"
          href="https://github.com/kevinlee-06/npc-food"
          target="_blank"
        ><IconGitHub />GitHub</a>
      </li>
      <div class="border-t border-zinc-600" />
      <li>
        <button
          class="flex items-center gap-2 p-2 hover:bg-zinc-700 dark:hover:bg-zinc-600"
          @click="() => { toggleDark(); toggleMobileMenu(); }"
        >
          <IconMoon />深色主題
        </button>
      </li>
    </menu>
  </Transition>
  <div
    v-show="!mobileMenuOpen"
    class="container flex flex-col items-center justify-start max-w-screen-x2 min-h-screen p-8 bg-zinc-100 dark:bg-zinc-900"
  >
    <NuxtPage />
  </div>
</template>

<style>
/* You can keep any custom styles here if needed */
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-1rem);
}

.container {
  max-width: 10000px;
}
</style>
