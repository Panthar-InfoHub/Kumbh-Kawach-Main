"use client"
import { useEffect } from 'react';
import { AlertCircle, WifiOff, Server, Shield } from 'lucide-react';

export default function Error({ error }) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    // Parse error message to detect multiple API failures
    const isMultipleAPIError = error?.message?.includes('Multiple services failed:') ||
        error?.message?.includes('Critical services unavailable:');

    const parseMultipleErrors = (errorMessage) => {
        console.log("Error message : ", errorMessage)
        console.log("Parsing checking : ", isMultipleAPIError)
        if (!isMultipleAPIError) return [];

        const lines = errorMessage.split('\n');
        return lines
            .filter(line => line.match(/^\d+\./))
            .map(line => {
                const match = line.match(/^\d+\.\s*(.+)/);
                return match ? match[1] : line;
            });
    };

    const errorList = parseMultipleErrors(error?.message || '');

    // Determine error type for appropriate icon
    const getErrorType = (message) => {
        if (message?.toLowerCase().includes('network') || message?.toLowerCase().includes('connection')) {
            return { type: 'network', icon: WifiOff, color: 'text-orange-600', bg: 'bg-orange-100' };
        }
        if (message?.toLowerCase().includes('unauthorized') || message?.toLowerCase().includes('authentication')) {
            return { type: 'auth', icon: Shield, color: 'text-yellow-600', bg: 'bg-yellow-100' };
        }
        if (message?.toLowerCase().includes('server') || message?.toLowerCase().includes('500')) {
            return { type: 'server', icon: Server, color: 'text-red-600', bg: 'bg-red-100' };
        }
        return { type: 'general', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' };
    };

    const errorType = getErrorType(error?.message);
    const ErrorIcon = errorType.icon;

    const getErrorTitle = () => {
        if (isMultipleAPIError) {
            return `${errorList.length} Services Failed`;
        }

        switch (errorType.type) {
            case 'network':
                return 'Connection Problem';
            case 'auth':
                return 'Access Denied';
            case 'server':
                return 'Server Error';
            default:
                return 'Something went wrong';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
                {/* Error Icon */}
                <div className={`flex items-center justify-center w-12 h-12 mx-auto ${errorType.bg} rounded-full mb-4`}>
                    <ErrorIcon className={`w-6 h-6 ${errorType.color}`} />
                </div>

                {/* Error Title */}
                <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {getErrorTitle()}
                    </h3>
                </div>

                {/* Multiple Error Details */}
                {isMultipleAPIError && errorList.length > 0 && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-800 mb-3">Failed Services:</h4>
                        <ul className="text-sm text-gray-700 space-y-2">
                            {errorList.map((errorMsg, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                                    <span>{errorMsg}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Single Error Details */}
                {!isMultipleAPIError && error?.message && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-800 mb-2">Error Details:</h4>
                        <p className="text-sm text-gray-600 break-words">
                            {error.message}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
