// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kwlmzwbghkstefrzrnvh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3bG16d2JnaGtzdGVmcnpybnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTY2MzgsImV4cCI6MjA2MDgzMjYzOH0.vL6LnngVcW-PPFguIcPSJXhF8uVV7iYTjda5GKzyCRg'

export const supabase = createClient(supabaseUrl, supabaseKey)
