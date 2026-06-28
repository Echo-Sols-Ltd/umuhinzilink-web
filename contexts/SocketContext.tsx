import React, { createContext, useContext, useEffect } from 'react'
import { socketService } from '@/services/socket'
import { useAuth } from '@/contexts/AuthContext'

const SocketContext = createContext<typeof socketService | null>(null)

export const useSocket = () => useContext(SocketContext)

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth()
    const userId = user?.id

    useEffect(() => {
        if (!userId) {
            socketService.disconnect()
            return
        }

        socketService.connect()

        return () => {
            socketService.disconnect()
        }
    }, [userId])

    return (
        <SocketContext.Provider value={socketService}>
            {children}
        </SocketContext.Provider>
    )
}
