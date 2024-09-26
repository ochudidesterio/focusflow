
import { createClient } from '@supabase/supabase-js'
import { REACT_APP_ANON_KEY, REACT_APP_SUPABASE_URL } from '../components/constants/Constants';
const supabaseUrl = REACT_APP_SUPABASE_URL
const supabaseKey = REACT_APP_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;