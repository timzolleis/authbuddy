import { CircleSlash } from 'lucide-react';
import { useNavigation } from '@remix-run/react';

export const ErrorContainer = ({ errors }: { errors: string[] }) => {
    return (
        <div className={'flex flex-col items-center gap-2  rounded-md border border-input p-3'}>
            <CircleSlash size={24}></CircleSlash>
            <h2 className={'text-2xl font-semibold tracking-tight'}>An error occurred</h2>
            <p className={'max-w-xl text-center text-sm text-muted-foreground'}>
                Shoot! We can't finish your request like this. Please try to fix the errors below or
                submit a GitHub issue.
            </p>
            <div className={'text-sm text-red-400'}>
                <ul className={'list-disc'}>
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
