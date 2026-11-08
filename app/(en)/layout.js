import "../globals.css";
import { buildMetadata, schema } from "../meta";
export { viewport } from "../meta";

export const metadata = buildMetadata("en");

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema("en")) }} />
        {children}
      </body>
    </html>
  );
}
