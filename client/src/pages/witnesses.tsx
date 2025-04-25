import WitnessList from "@/components/witnesses/WitnessList";
import { useLanguage } from "@/context/LanguageContext";

export default function Witnesses() {
  const { t } = useLanguage();
  return (
    <section id="witnesses" className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">{t('witnesses.title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('witnesses.description')}
          </p>
        </div>
        
        <WitnessList />
      </div>
    </section>
  );
}
