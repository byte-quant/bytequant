import { LocalizedInfoPage } from "../../components/LocalizedInfoPage";
import { infoMetadata } from "../../lib/localized-metadata";
export const metadata = infoMetadata("de", "faq");
export default function Page() { return <LocalizedInfoPage locale="de" pageKey="faq" />; }
