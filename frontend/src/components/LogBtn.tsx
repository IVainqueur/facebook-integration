import { MouseEventHandler } from 'react';
import { FiFacebook } from 'react-icons/fi';

interface LogBtnProps {
    In?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;

}

const LogBtn = ({In = false, onClick}: LogBtnProps) => {
    return (
        <button className={`${In ? "bg-sky-600 text-white": "bg-white text-sky-600"} flex items-center gap-2 p-6 rounded h-fit w-fit`} onClick={onClick}>
            {In && <FiFacebook fill='white'/>}
            <span>
                {
                    In ? "Login With Facebook" : "Log Out"
                }
            </span>
        </button>
    )
}

export default LogBtn