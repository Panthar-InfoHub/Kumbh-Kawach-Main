import React from 'react'

export default function Loading() {
    return (
        <div className="flex flex-1 flex-col">
            <header className="border-b bg-white px-6 py-4">
                <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
            </header>

            <div className="flex flex-1 gap-6 p-6">
                <div className="flex-1 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200" />
                    ))}
                </div>
                <div className="hidden w-80 lg:block">
                    <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
                </div>
            </div>
        </div>
    )
}