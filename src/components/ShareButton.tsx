"use client"

import { Button as ButtonAria, Menu, MenuItem, MenuItemProps, MenuTrigger, Popover } from 'react-aria-components';
import { LuShare2, LuFacebook, LuMail, LuCopy, LuTwitter } from "react-icons/lu";
import { FaWhatsapp, FaReddit } from "react-icons/fa";
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ShareButton() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    // After mounting, we can safely access the theme
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Use resolvedTheme if available, fallback to theme, and default to 'light' when not mounted yet
    const currentTheme = mounted ? resolvedTheme || theme : 'light';

    const handleShare = (platform: string) => {
        const url = window.location.href;
        const text = "Remove image backgrounds instantly with AI - Try Eraseto now!";
        
        let shareUrl = '';
        
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
            case 'reddit':
                shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
                break;
            case 'mail':
                shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard!');
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <MenuTrigger>
            <ButtonAria
                aria-label="Share"
                className={`relative group inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                    currentTheme === 'light'
                        ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                }`}
            >
                <div className="relative flex items-center gap-2">
                    <LuShare2 className={`size-[1.2rem] ${
                        currentTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                    <span className={currentTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                        Share us
                    </span>
                </div>
            </ButtonAria>
            <Popover placement='bottom right' className={`origin-top-left overflow-auto rounded-lg border p-1 shadow-lg ring-1 ring-black/5 fill-mode-forwards entering:animate-in entering:fade-in entering:zoom-in-95 exiting:animate-out exiting:fade-out exiting:zoom-out-95 ${
                currentTheme === 'light'
                    ? 'bg-white border-gray-200'
                    : 'bg-gray-800 border-gray-700'
            }`}>
                <Menu className="outline-none">
                    <ActionItem id="facebook" onAction={() => handleShare('facebook')}>
                        <LuFacebook className="mr-2 size-4 text-[#1877F2]" />
                        Facebook
                    </ActionItem>
                    <ActionItem id="twitter" onAction={() => handleShare('twitter')}>
                        <LuTwitter className="mr-2 size-4 text-[#1DA1F2]" />
                        Twitter
                    </ActionItem>
                    <ActionItem id="whatsapp" onAction={() => handleShare('whatsapp')}>
                        <FaWhatsapp className="mr-2 size-4 text-[#25D366]" />
                        WhatsApp
                    </ActionItem>
                    <ActionItem id="reddit" onAction={() => handleShare('reddit')}>
                        <FaReddit className="mr-2 size-4 text-[#FF4500]" />
                        Reddit
                    </ActionItem>
                    <ActionItem id="mail" onAction={() => handleShare('mail')}>
                        <LuMail className="mr-2 size-4 text-[#EA4335]" />
                        Email
                    </ActionItem>
                    <ActionItem id="copy" onAction={() => handleShare('copy')}>
                        <LuCopy className={`mr-2 size-4 ${
                            currentTheme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`} />
                        Copy Link
                    </ActionItem>
                </Menu>
            </Popover>
        </MenuTrigger>
    );
}

function ActionItem(props: MenuItemProps) {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const currentTheme = mounted ? resolvedTheme || theme : 'light';

    return (
        <MenuItem
            {...props}
            className={`group box-border flex w-full cursor-default items-center rounded-md p-2 text-sm outline-none transition-colors duration-200 ${
                currentTheme === 'light'
                    ? 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
                    : 'text-gray-300 hover:bg-gray-700 focus:bg-gray-700'
            }`}
        />
    );
} 