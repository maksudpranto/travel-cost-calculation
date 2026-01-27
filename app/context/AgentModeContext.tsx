"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AgentModeContextType {
    isAgentMode: boolean;
    setAgentMode: (enabled: boolean) => void;
    toggleAgentMode: () => void;
}

const AgentModeContext = createContext<AgentModeContextType | undefined>(undefined);

export function AgentModeProvider({ children }: { children: React.ReactNode }) {
    const [isAgentMode, setIsAgentMode] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('agent_mode_enabled');
        if (saved === 'true') {
            setIsAgentMode(true);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage when changed
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('agent_mode_enabled', isAgentMode.toString());
        }
    }, [isAgentMode, isLoaded]);

    const setAgentMode = (enabled: boolean) => setIsAgentMode(enabled);
    const toggleAgentMode = () => setIsAgentMode(prev => !prev);

    return (
        <AgentModeContext.Provider value={{ isAgentMode, setAgentMode, toggleAgentMode }}>
            {children}
        </AgentModeContext.Provider>
    );
}

export function useAgentMode() {
    const context = useContext(AgentModeContext);
    if (context === undefined) {
        throw new Error('useAgentMode must be used within an AgentModeProvider');
    }
    return context;
}
