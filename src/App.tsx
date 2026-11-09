import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./store/AppStore";
import { UiProvider } from "./store/UiStore";
import { ScrollToTop, SiteLayout } from "./components/SiteLayout";
import { HomePage } from "./pages/HomePage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { OfferDetailPage } from "./pages/OfferDetailPage";
import { ProposePage } from "./pages/ProposePage";
import { ProfilePage } from "./pages/ProfilePage";
import { DashboardPage } from "./pages/DashboardPage";
import { PublishPage } from "./pages/PublishPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { TrustPage } from "./pages/TrustPage";
import { CommunityPage } from "./pages/CommunityPage";
import { WaitlistPage } from "./pages/WaitlistPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppProvider>
        <UiProvider>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<HomePage />} />
              <Route path="descobrir" element={<DiscoverPage />} />
              <Route path="oferta/:offerId" element={<OfferDetailPage />} />
              <Route path="propor/:offerId" element={<ProposePage />} />
              <Route path="perfil/:personId" element={<ProfilePage />} />
              <Route path="painel" element={<DashboardPage />} />
              <Route path="publicar" element={<PublishPage />} />
              <Route path="como-funciona" element={<HowItWorksPage />} />
              <Route path="confianca" element={<TrustPage />} />
              <Route path="comunidade" element={<CommunityPage />} />
              <Route path="lista-de-espera" element={<WaitlistPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </UiProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
