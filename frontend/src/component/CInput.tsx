import React from "react";

const defaultClassName = "hover:placeholder:text-gray-400 w-full h-12 pl-10 pr-4 rounded-md bg-[#4a4c52] text-white text-base focus:outline-none focus:ring-2 focus:ring-[#ff570c] placeholder-gray-500";

export interface CInputInterface extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    var: any | string;
    setVar: (value: string) => void;
    addClassName?: string;
    error?: string;
    ref?: any;
    icon?: string;
}

const CInput: React.FC<CInputInterface> = ({ 
    className: className = defaultClassName, 
    var: Var, 
    setVar: SetVar, 
    addClassName: AddClassName, 
    error, 
    ref,
    icon,
    ...props 
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        SetVar(e.target.value);
    };

    return (
        <div className="w-full">
            <div className="relative">
                {icon && (
                    <i className={`${icon} absolute left-3 top-1/2 -translate-y-1/2 text-gray-400`}></i>
                )}
                <input
                    {...props}
                    className={AddClassName === undefined ? className : `${className} ${AddClassName}`}
                    value={Var}
                    onChange={handleChange}
                    ref={ref}
                />
            </div>
            {error && (
                <div className="mt-1 flex items-center gap-1 text-red-400">
                    <i className="fa fa-exclamation-circle"></i>
                    <p className="text-sm">{error}</p>
                </div>
            )}
        </div>
    );
};

export default CInput;