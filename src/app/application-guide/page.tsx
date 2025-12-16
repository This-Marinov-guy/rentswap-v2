import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rental Application Guide 2025 | RentSwap",
  description:
    "Learn how to craft the perfect rental application introduction letter. Step-by-step guide with tips and examples to help you stand out to landlords and housing agents.",
  openGraph: {
    title: "Rental Application Guide 2025 | RentSwap",
    description:
      "Learn how to craft the perfect rental application introduction letter. Step-by-step guide with tips and examples.",
    url: "https://rentswap.nl/application-guide",
    siteName: "RentSwap",
    locale: "en_US",
    type: "website",
  },
};

export default function ApplicationGuidePage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.date}>25 October 2024</div>
            <h1 className={styles.title}>Rental Application Guide 2025</h1>
          </div>

          <div className={styles.intro}>
            <p>
              Crafting the perfect rental application introduction letter is the
              bare minimum requirement to stand a chance in finding an apartment.
              It's a straightforward step that shouldn't take more than an hour,
              but it's crucial to get it right. Don't rush or cut corners!
            </p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              The Goal of a Rental Application Introduction Letter
            </h2>
            <p className={styles.sectionIntro}>
              Your letter should accomplish three main goals. To convince a
              landlord or housing agent that:
            </p>
            <ul className={styles.goalsList}>
              <li>
                <strong>You can pay the rent (most important)</strong>
                <br />
                Convince the housing agent or landlord that you can pay the rent
                throughout the leasing period without issue.
              </li>
              <li>
                <strong>You're a Low-Maintenance Tenant</strong>
                <br />
                Demonstrate that you'll be a reliable, responsible, and low-effort
                tenant who won't cause problems, damage the property, or demand
                excessive attention.
              </li>
              <li>
                <strong>Present No Red Flags</strong>
                <br />
                Highlight that you don't have habits or characteristics that could
                negatively impact the property (e.g., smoking, pets, or noisy
                behavior).
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Documents to Attach Next to the Letter
            </h2>
            <p>
              The best way to convince someone is to show them proof. In this
              context, these are documents that back up your claims and prove the
              solid proof about your claims about yourself. Include any evidence
              that validates the three main points outlined earlier. Organizing
              the information in a straightforward manner to help the reader.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Step-by-step Application Writing Guide
            </h2>

            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Introduction</h3>
                  <p className={styles.stepWhat}>
                    <strong>What to Include:</strong> Your name, reason for
                    contacting (interest in property).
                  </p>
                  <p className={styles.stepTips}>
                    <strong>Tips:</strong> Keep it short and professional.
                  </p>
                  <div className={styles.stepExample}>
                    <strong>Example:</strong> "Dear [Landlord's Name], my name is
                    [Your Name], and I'm very interested in renting the apartment
                    at [Address]."
                  </div>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>About Yourself</h3>
                  <p className={styles.stepWhat}>
                    <strong>What to Include:</strong> Brief details about you
                    (job, age, status, reason for renting).
                  </p>
                  <p className={styles.stepTips}>
                    <strong>Tips:</strong> Focus on stability.
                  </p>
                  <div className={styles.stepExample}>
                    <strong>Example:</strong> "I am a [software developer/student/etc.],
                    and I'm relocating to [city] for [reason]."
                  </div>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Financial Stability</h3>
                  <p className={styles.stepWhat}>
                    <strong>What to Include:</strong> Provide basic information
                    about your income, savings, or guarantor.
                  </p>
                  <p className={styles.stepTips}>
                    <strong>Tips:</strong> Go into too much detail, especially if
                    you don't have a stable income. Mention that documents can be
                    provided on request. I suggest making a list.
                  </p>
                  <div className={styles.stepExample}>
                    <strong>Example:</strong> "Here is the list of documents I
                    attached that back up our claims:
                    <ul>
                      <li>My bank account statement with XY EUR</li>
                      <li>
                        My family's business proof of gross income with an annual
                        gross income of YZ EUR.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Why You'd Be a Good Tenant</h3>
                  <p className={styles.stepWhat}>
                    <strong>What to Include:</strong> Mention your responsible
                    behavior and respect for property.
                  </p>
                  <p className={styles.stepTips}>
                    <strong>Tips:</strong> Be specific but concise.
                  </p>
                  <div className={styles.stepExample}>
                    <strong>Example:</strong> "I'm a non-smoker, don't have pets,
                    and I take great pride in keeping my living space clean and
                    orderly."
                  </div>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>5</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Flexibility and Willingness</h3>
                  <p className={styles.stepWhat}>
                    <strong>What to Include:</strong> Offer flexibility on move-in
                    dates and willingness to cooperate.
                  </p>
                  <p className={styles.stepTips}>
                    <strong>Tips:</strong> Landlords appreciate flexibility.
                  </p>
                  <div className={styles.stepExample}>
                    <strong>Example:</strong> "I am ready to move in on [date] and
                    can adjust to your preferences."
                  </div>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>6</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Conclusion and Contact</h3>
                  <p className={styles.stepWhat}>
                    <strong>What to Include:</strong> Thank them for considering
                    your application and invite further questions.
                  </p>
                  <p className={styles.stepTips}>
                    <strong>Tips:</strong> Keep it polite and open.
                  </p>
                  <div className={styles.stepExample}>
                    <strong>Example:</strong> "Thank you for considering my
                    application. I would be happy to provide further documentation
                    or answer any questions."
                  </div>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>7</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Closing</h3>
                  <p className={styles.stepWhat}>
                    <strong>What to Include:</strong> Sign off with your name and
                    contact information.
                  </p>
                  <p className={styles.stepTips}>
                    <strong>Tips:</strong> Keep it professional.
                  </p>
                  <div className={styles.stepExample}>
                    <strong>Example:</strong> "Best regards, [Your Name]. Email:
                    [Your Email], Phone: [Your Phone Number]."
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

