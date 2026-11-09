import { Link, useSearchParams } from "react-router-dom";
import { usePageMeta } from "../lib/usePageMeta";
import { Reveal } from "../components/SiteLayout";
import { WaitlistForm } from "../components/WaitlistForm";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  MailIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "../components/Icons";

export function WaitlistPage() {
  usePageMeta(
    "Lista de espera do lançamento",
    "Entre na lista de lançamento da Percebera com o seu email e LinkedIn. Receba o primeiro convite para trocar saberes em Moçambique.",
  );
  const [params] = useSearchParams();
  const interest = params.get("interesse") ?? undefined;

  return (
    <div className="page waitlist-page">
      <section className="page-hero page-hero--waitlist">
        <div className="container">
          <p className="eyebrow">Lançamento oficial</p>
          <h1 className="display-1 display-1--page">
            Entre antes de a praça de trocas abrir.
          </h1>
          <p className="page-hero__lead page-hero__lead--wide">
            A Percebera está em preparação. Deixe o seu email e, se quiser, o seu LinkedIn. O
            primeiro convite vai para quem quer ensinar e aprender sem dinheiro pelo meio.
          </p>
          <div className="statement-tags">
            <span>Piloto começa em Maputo</span>
            <span>Convite antes da abertura</span>
          </div>
        </div>
      </section>

      <section className="section waitlist-section">
        <div className="container waitlist-layout">
          <Reveal className="waitlist-main">
            <div className="waitlist-card">
              <div className="waitlist-card__head">
                <span className="mono-label">Inscrição</span>
                <h2 className="display-2">Receber o convite de lançamento.</h2>
                <p>
                  Leva menos de um minuto. O email é obrigatório para lhe podermos escrever. O
                  LinkedIn é opcional e ajuda a equipa a conhecer quem quer participar.
                </p>
              </div>
              <WaitlistForm source="lista-de-espera" initialInterest={interest} />
            </div>

            <div className="waitlist-privacy">
              <div>
                <span className="waitlist-privacy__icon">
                  <MailIcon size={19} />
                </span>
                <h3>O que é enviado</h3>
                <p>
                  Email, LinkedIn opcional, interesse e a página de origem vão para a equipa da
                  Percebera. Não são vendidos nem usados para publicidade de terceiros.
                </p>
              </div>
              <div>
                <span className="waitlist-privacy__icon">
                  <ShieldCheckIcon size={19} />
                </span>
                <h3>O que fica no navegador</h3>
                <p>
                  Guardamos a inscrição neste dispositivo para evitar duplicados. Pode apagar os
                  dados do site no navegador para a remover daqui.
                </p>
              </div>
              <div>
                <span className="waitlist-privacy__icon">
                  <UsersIcon size={19} />
                </span>
                <h3>O que ainda não existe</h3>
                <p>
                  Ainda não há contas, aplicação móvel nem cobranças. Esta lista serve apenas para
                  preparar o lançamento e o piloto com quem quer participar.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={90} className="waitlist-side">
            <div className="waitlist-side__block">
              <p className="eyebrow">Porque entrar agora</p>
              <h2 className="display-3">O primeiro convite abre portas antes do público.</h2>
              <ul className="check-list">
                <li>
                  <CheckCircleIcon size={16} />
                  Prioridade nas vagas do piloto em Maputo e Matola
                </li>
                <li>
                  <CheckCircleIcon size={16} />
                  Convite para testar o mecanismo de troca antes da abertura
                </li>
                <li>
                  <CheckCircleIcon size={16} />
                  Guia prático da primeira troca, escrito para começar pequeno
                </li>
                <li>
                  <CheckCircleIcon size={16} />
                  Possibilidade de contar à equipa o que sabe ensinar
                </li>
              </ul>
            </div>

            <div className="waitlist-side__block">
              <p className="mono-label">O que acontece depois</p>
              <ol className="waitlist-steps">
                <li>
                  <span>01</span>
                  <p>
                    <strong>Recebe o pedido no email.</strong> A equipa recebe a inscrição e lê
                    cada resposta.
                  </p>
                </li>
                <li>
                  <span>02</span>
                  <p>
                    <strong>Conhecemos o seu interesse.</strong> Quem quer ensinar, aprender ou
                    trazer uma organização ajuda a definir o piloto.
                  </p>
                </li>
                <li>
                  <span>03</span>
                  <p>
                    <strong>Enviamos o convite de lançamento.</strong> O acesso abre primeiro para
                    a lista, por ordem de inscrição.
                  </p>
                </li>
              </ol>
            </div>

            <div className="waitlist-side__links">
              <Link to="/como-funciona" className="text-link">
                Entender o modelo
                <ArrowRightIcon size={15} />
              </Link>
              <Link to="/descobrir" className="text-link">
                Explorar a demonstração
                <ArrowRightIcon size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container waitlist-honesty">
          <div>
            <p className="eyebrow">Transparência</p>
            <h2 className="display-2">Uma lista de espera, não uma promessa de lançamento.</h2>
            <p>
              A data de abertura depende de parcerias, financiamento e do resultado do piloto. A
              lista serve para preparar essa fase com pessoas reais. Quando houver data, a equipa
              escreve. Se o lançamento atrasar, também avisamos.
            </p>
          </div>
          <div className="waitlist-honesty__points">
            <div>
              <strong>Sem criação de conta</strong>
              <p>Não pedimos palavra-passe, número de telefone nem documento.</p>
            </div>
            <div>
              <strong>Sem pagamento</strong>
              <p>Entrar na lista é gratuito e não há cartão envolvido.</p>
            </div>
            <div>
              <strong>Sem dados inventados</strong>
              <p>Perfis, números e histórias desta página são ilustrativos.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
