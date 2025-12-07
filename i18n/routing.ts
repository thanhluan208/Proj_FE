import { createNavigation } from "next-intl/navigation"
import { defineRouting } from "next-intl/routing"

import { LANGUAGE } from "@/types"

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: [LANGUAGE.EN, LANGUAGE.VI],

	// Used when no locale matches
	defaultLocale: LANGUAGE.EN,

	localePrefix: "always"
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
	createNavigation(routing)
