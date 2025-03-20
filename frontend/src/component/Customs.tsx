import React from "react";

const defaultClassName_i = "hover:placeholder:text-gray-700 inline w-full h-10 p-1 rounded bg-[#F7F7F7] text-black text-lg focus:outline-2 focus:outline-[#ff590cc0]";
interface CInputInterface_i extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string; // Make className optional
    var: any | string;
    setVar: (value: string) => void; // Specify the type for SetVar
    addClassName?: string;
    error?: string
}

const CInput: React.FC<CInputInterface_i> = ({ className: className = defaultClassName_i, var: Var, setVar: SetVar, addClassName: AddClassName, error, ...props }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        SetVar(e.target.value); // Update the state using SetVar
    };

    return (
        <span className="text-red-600">
            <input
                {...props}
                className={AddClassName === undefined ? className : `${className} ${AddClassName}`}
                value={Var}
                onChange={handleChange}
                style={error ? { marginBottom: '0' } : {}}
            />
            {error && <p>{error}</p>}
        </span>
    );
};


const defaultClassName_t = "hover:placeholder:text-gray-700 inline w-full h-10 p-1 rounded bg-[#F7F7F7] text-black text-lg focus:outline-2 focus:outline-[#ff590cc0]";
interface CInputInterface_t extends React.InputHTMLAttributes<HTMLTextAreaElement> {
    className?: string; // Make className optional
    var: any | string;
    setVar: (value: string) => void; // Specify the type for SetVar
    addClassName?: string;
    error?: string
}

const CTextArea: React.FC<CInputInterface_t> = ({ className: className = defaultClassName_t, var: Var, setVar: SetVar, addClassName: AddClassName, error, ...props }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        SetVar(e.target.value); // Update the state using SetVar
    };

    return (
        <span className="text-red-600">
            <textarea
                {...props}
                className={AddClassName === undefined ? className : `${className} ${AddClassName}`}
                value={Var}
                onChange={handleChange}
                style={error ? { marginBottom: '0' } : {}}
            />
            {error && <p>{error}</p>}
        </span>
    );
};

export default { CTextArea, CInput };