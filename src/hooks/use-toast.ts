import * as React from "react"

import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        setDismissed(toastId)
      } else {
        state.toasts.forEach((toast) => {
          setDismissed(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

function setDismissed(id: string) {
  if (toastTimeouts.has(id)) {
    clearTimeout(toastTimeouts.get(id))
  }

  toastTimeouts.set(
    id,
    setTimeout(() => {
      toastTimeouts.delete(id)
      dispatch({
        type: "REMOVE_TOAST",
        toastId: id,
      })
    }, TOAST_REMOVE_DELAY)
  )
}

type ToastContextType = {
  toasts: ToasterToast[]
  toast: (props: Omit<ToasterToast, "id">) => void
  dismiss: (toastId?: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

const initialState: State = { toasts: [] }
const dispatch = React.createRef<React.Dispatch<Action>>()

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, _dispatch] = React.useReducer(reducer, initialState)
  
  React.useEffect(() => {
    dispatch.current = _dispatch
  }, [_dispatch])

  const toast = React.useCallback((props: Omit<ToasterToast, "id">) => {
    const id = genId()
    const newToast = { id, ...props }

    dispatch.current?.({
      type: "ADD_TOAST",
      toast: newToast,
    })

    return id
  }, [])

  const dismiss = React.useCallback((toastId?: string) => {
    dispatch.current?.({
      type: "DISMISS_TOAST",
      toastId,
    })
  }, [])

  const value = React.useMemo(
    () => ({
      toasts: state.toasts,
      toast,
      dismiss,
    }),
    [state.toasts, toast, dismiss]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}

export const toast = (props: Omit<ToasterToast, "id">) => {
  dispatch.current?.({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id: genId(),
    },
  })
}
