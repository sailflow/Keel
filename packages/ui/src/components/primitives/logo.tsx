import * as React from 'react';

import { cn } from '../../lib/utils';

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
    return (
        <>
            <img
                src="/logo.png"
                alt="Keel Logo"
                className={cn('block h-6 w-6 object-contain dark:hidden', className)}
                {...props}
            />
            <img
                src="/logo-dark.png"
                alt="Keel Logo"
                className={cn('hidden h-6 w-6 object-contain dark:block', className)}
                {...props}
            />
        </>
    );
}
