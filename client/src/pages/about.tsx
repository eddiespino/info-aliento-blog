import FeaturedWitness from "@/components/FeaturedWitness";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{t('about.title')}</h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            {t('about.description')}
          </p>
        </div>
        
        <FeaturedWitness />
        
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">{t('about.purpose')}</h3>
          <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
            {t('about.purposeDesc')}
          </p>
          
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-6 sm:mt-8 mb-3 sm:mb-4">{t('about.features')}</h3>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2 sm:space-y-3 text-base sm:text-lg text-muted-foreground">
            <li>{t('about.feature1')}</li>
            <li>{t('about.feature2')}</li>
            <li>{t('about.feature3')}</li>
            <li>{t('about.feature4')}</li>
            <li>{t('about.tech')}</li>
          </ul>
          
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-6 sm:mt-8 mb-3 sm:mb-4">{t('about.techDesc')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-3 sm:mt-4">
            <div className="p-4 sm:p-6 bg-accent/50 rounded-lg border border-border">
              <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{t('about.tech')}</h4>
              <p className="text-sm sm:text-base text-muted-foreground">{t('about.techDesc')}</p>
            </div>
            <div className="p-4 sm:p-6 bg-accent/50 rounded-lg border border-border">
              <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{t('network.title')}</h4>
              <p className="text-sm sm:text-base text-muted-foreground">{t('network.subtitle')}</p>
            </div>
            <div className="p-4 sm:p-6 bg-accent/50 rounded-lg border border-border">
              <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{t('witnesses.title')}</h4>
              <p className="text-sm sm:text-base text-muted-foreground">{t('witnesses.description')}</p>
            </div>
            <div className="p-4 sm:p-6 bg-accent/50 rounded-lg border border-border">
              <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{t('profile.about')}</h4>
              <p className="text-sm sm:text-base text-muted-foreground">{t('about.description')}</p>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>
          <div className="flex justify-center">
            <ViewOnlyModeToggle />
          </div>
        </div>
      </div>
    </section>
  );
}
