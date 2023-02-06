import { useEffect } from "react";
import 'zenn-content-css';

type Props = {
    html: string;
}

export const Article = (props: Props): JSX.Element => {
    const { html } = props;

    useEffect(()=> {
        import("zenn-embed-elements")
      },[])
      
    return (
        <div 
            className="znc"
            dangerouslySetInnerHTML={{
                __html: html
            }}
        />
    );
};
