import 'react-native-get-random-values'
import { nanoid } from 'nanoid'

export function uid() {
    return nanoid(14)
}
