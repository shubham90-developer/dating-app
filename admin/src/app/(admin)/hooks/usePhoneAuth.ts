'use client'

import { useState, useRef } from 'react'
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth'
import { firebaseAuth } from '../config/firebase'
export default function usePhoneAuth() {
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null)
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null)

  const setupRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
        size: 'invisible',
      })
    }
    return recaptchaRef.current
  }

  const sendOtp = async (phoneNumber: string) => {
    setLoading(true)
    setError(null)
    try {
      const verifier = setupRecaptcha()
      const result = await signInWithPhoneNumber(firebaseAuth, phoneNumber, verifier)
      setConfirmation(result)
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (code: string) => {
    if (!confirmation) return
    setLoading(true)
    setError(null)
    try {
      const result = await confirmation.confirm(code)
      const token = await result.user.getIdToken()
      setFirebaseToken(token)
      return token
    } catch (err: any) {
      setError(err.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return { sendOtp, verifyOtp, confirmation, firebaseToken, loading, error }
}
