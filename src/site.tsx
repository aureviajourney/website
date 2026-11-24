import { createContext, useContext, type ReactNode } from 'react'
import type { Destination, Settings } from './api'
import { destinations, settings } from './data/seed'

// Static for this phase. Swap the value below for fetched data when the backend exists.
interface Site { settings: Settings; destinations: Destination[]; loading: boolean }
const value: Site = { settings, destinations, loading: false }
const Ctx = createContext<Site>(value)
// eslint-disable-next-line react-refresh/only-export-components
export const useSite = () => useContext(Ctx)
export const SiteProvider = ({ children }: { children: ReactNode }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>
