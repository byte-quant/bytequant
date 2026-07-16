import { LocalizedInfoPage } from "../../components/LocalizedInfoPage";
import { infoMetadata } from "../../lib/localized-metadata";
export const metadata = infoMetadata("zh", "faq");
export default function Page() { return <LocalizedInfoPage locale="zh" pageKey="faq" />; }
