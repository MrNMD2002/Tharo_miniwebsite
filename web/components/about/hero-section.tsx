interface HeroSectionProps {
    title: string;
    subtitle: string;
    backgroundImage?: string;
    backgroundColor?: string;
}

export function HeroSection({ 
    title, 
    subtitle, 
    backgroundImage, 
    backgroundColor = "#8B1538" 
}: HeroSectionProps) {
    return (
        <div 
            className="relative py-16 md:py-20 flex items-center justify-center text-white overflow-hidden"
            style={{ backgroundColor: backgroundImage ? undefined : backgroundColor }}
        >
            {backgroundImage && (
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    <div className="absolute inset-0 bg-burgundy-900/70" />
                </div>
            )}
            
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight">
                    {title}
                </h1>
                <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

