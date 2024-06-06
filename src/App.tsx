import './App.css'
import {PageController, WidgetsProvider} from "@sitecore-search/react";
import SearchWidget from "./widgets/SearchWidget";

const SEARCH_CONFIG = {
    env: import.meta.env.VITE_SEARCH_ENV,
    customerKey: import.meta.env.VITE_SEARCH_CUSTOMER_KEY,
    apiKey: import.meta.env.VITE_SEARCH_API_KEY,
    publicSuffix: true,
};


function App() {
    PageController.getContext().setLocaleLanguage('en');
    PageController.getContext().setLocaleCountry('us');
    return (
        <>
            <div className="w-[90%] m-auto flex">
                <WidgetsProvider {...SEARCH_CONFIG}>
                    <SearchWidget rfkId={'rfkid_7'} />
                </WidgetsProvider>
            </div>
        </>
    )
}

export default App
