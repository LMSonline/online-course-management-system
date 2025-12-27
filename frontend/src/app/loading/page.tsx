import { Loader2 } from "lucide-react";

export default function LoadingPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
                <p className="text-gray-600">Please wait while we prepare your content</p>
            </div>
        </div>
    );
}
