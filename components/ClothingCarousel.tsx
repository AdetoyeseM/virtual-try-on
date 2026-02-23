'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ClothingItem {
    id: string;
    name: string;
    image: string;
    category: string;
}

interface ClothingCarouselProps {
    items: ClothingItem[];
    selectedId: string | null;
    onSelect: (item: ClothingItem) => void;
}

const ClothingCarousel: React.FC<ClothingCarouselProps> = ({ items, selectedId, onSelect }) => {
    return (
        <div className="w-full py-8">
            <h3 className="text-xl font-semibold mb-6 px-4 text-zinc-300">Select Clothing</h3>
            <div className="flex overflow-x-auto pb-6 px-4 gap-6 no-scrollbar snap-x">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        onClick={() => onSelect(item)}
                        className={cn(
                            "flex-shrink-0 w-40 snap-center cursor-pointer group",
                            "preserve-3d perspective-1000"
                        )}
                    >
                        <div className={cn(
                            "relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-300",
                            "border-2",
                            selectedId === item.id
                                ? "border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                : "border-transparent bg-zinc-900 group-hover:border-zinc-700"
                        )}>
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-xs font-medium text-white line-clamp-1">{item.name}</p>
                                <p className="text-[10px] text-zinc-400 capitalize">{item.category}</p>
                            </div>

                            {selectedId === item.id && (
                                <motion.div
                                    layoutId="active-indicator"
                                    className="absolute inset-0 bg-indigo-500/10 pointer-events-none"
                                />
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ClothingCarousel;
