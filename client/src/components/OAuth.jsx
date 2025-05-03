import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuthenticate() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async () =>{


        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app);
            const result = await signInWithPopup(auth , provider);

            const res = await fetch('/api/auth/google',{
                method : 'POST',
                headers : {
                    'Content-Type':'application/json',
                },
                body :JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL

                })
            });

            const data = await res.json()
            if (res.ok){
                dispatch(signInSuccess(data))
                navigate('/')
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <button
            type="button"
            className="w-full flex items-center justify-center border border-purple-700 text-black rounded-lg transition hover:opacity-90 py-2"
            onClick={handleGoogleClick}
        >
            <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google Logo" className="w-6 h-6 mr-2"/>
            <span>Continue with Google</span>
        </button>

    )
}