import { createContext } from "react";

const AppContext = createContext({
    color: {
        primary: '',
        accent: ''
    },
    changeColor: (primary, accent) => { },
});

export default AppContext;
