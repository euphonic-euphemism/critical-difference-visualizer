import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart, Scatter, ReferenceDot } from 'recharts';
import { Calculator, Table, Info, TrendingUp, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

// --- DATA PROCESSING ---

const RAW_CSV_80 = `Scenario,N_Effective,Score_Scale_Max,Confidence_Level,Raw_Score,Score_Percent,Lower_Limit_Percent,Upper_Limit_Percent
WW_10,10,10,0.8,0,0,0,10
WW_10,10,10,0.8,1,10,0,30
WW_10,10,10,0.8,2,20,10,40
WW_10,10,10,0.8,3,30,10,50
WW_10,10,10,0.8,4,40,20,60
WW_10,10,10,0.8,5,50,30,70
WW_10,10,10,0.8,6,60,40,80
WW_10,10,10,0.8,7,70,50,90
WW_10,10,10,0.8,8,80,60,90
WW_10,10,10,0.8,9,90,70,100
WW_10,10,10,0.8,10,100,90,100
WW_25,25,25,0.8,0,0,0,4
WW_25,25,25,0.8,1,4,0,12
WW_25,25,25,0.8,2,8,4,20
WW_25,25,25,0.8,3,12,4,24
WW_25,25,25,0.8,4,16,8,28
WW_25,25,25,0.8,5,20,8,32
WW_25,25,25,0.8,6,24,12,40
WW_25,25,25,0.8,7,28,16,44
WW_25,25,25,0.8,8,32,20,48
WW_25,25,25,0.8,9,36,24,52
WW_25,25,25,0.8,10,40,24,56
WW_25,25,25,0.8,11,44,28,60
WW_25,25,25,0.8,12,48,32,64
WW_25,25,25,0.8,13,52,36,68
WW_25,25,25,0.8,14,56,40,72
WW_25,25,25,0.8,15,60,44,76
WW_25,25,25,0.8,16,64,48,80
WW_25,25,25,0.8,17,68,52,80
WW_25,25,25,0.8,18,72,56,84
WW_25,25,25,0.8,19,76,60,88
WW_25,25,25,0.8,20,80,64,92
WW_25,25,25,0.8,21,84,72,92
WW_25,25,25,0.8,22,88,76,96
WW_25,25,25,0.8,23,92,80,96
WW_25,25,25,0.8,24,96,88,100
WW_25,25,25,0.8,25,100,96,100
Phoneme_10,25,30,0.8,0,0,0,3.3
Phoneme_10,25,30,0.8,1,3.3,0,10
Phoneme_10,25,30,0.8,2,6.7,3.3,16.7
Phoneme_10,25,30,0.8,3,10,3.3,20
Phoneme_10,25,30,0.8,4,13.3,6.7,26.7
Phoneme_10,25,30,0.8,5,16.7,6.7,30
Phoneme_10,25,30,0.8,6,20,10,33.3
Phoneme_10,25,30,0.8,7,23.3,13.3,36.7
Phoneme_10,25,30,0.8,8,26.7,13.3,43.3
Phoneme_10,25,30,0.8,9,30,16.7,46.7
Phoneme_10,25,30,0.8,10,33.3,20,50
Phoneme_10,25,30,0.8,11,36.7,23.3,53.3
Phoneme_10,25,30,0.8,12,40,26.7,56.7
Phoneme_10,25,30,0.8,13,43.3,26.7,60
Phoneme_10,25,30,0.8,14,46.7,30,63.3
Phoneme_10,25,30,0.8,15,50,33.3,66.7
Phoneme_10,25,30,0.8,16,53.3,36.7,70
Phoneme_10,25,30,0.8,17,56.7,40,73.3
Phoneme_10,25,30,0.8,18,60,43.3,73.3
Phoneme_10,25,30,0.8,19,63.3,46.7,76.7
Phoneme_10,25,30,0.8,20,66.7,50,80
Phoneme_10,25,30,0.8,21,70,53.3,83.3
Phoneme_10,25,30,0.8,22,73.3,56.7,86.7
Phoneme_10,25,30,0.8,23,76.7,63.3,86.7
Phoneme_10,25,30,0.8,24,80,66.7,90
Phoneme_10,25,30,0.8,25,83.3,70,93.3
Phoneme_10,25,30,0.8,26,86.7,73.3,93.3
Phoneme_10,25,30,0.8,27,90,80,96.7
Phoneme_10,25,30,0.8,28,93.3,83.3,96.7
Phoneme_10,25,30,0.8,29,96.7,90,100
Phoneme_10,25,30,0.8,30,100,96.7,100
WW_50,50,50,0.8,0,0,0,2
WW_50,50,50,0.8,1,2,0,6
WW_50,50,50,0.8,2,4,2,10
WW_50,50,50,0.8,3,6,2,12
WW_50,50,50,0.8,4,8,4,16
WW_50,50,50,0.8,5,10,4,18
WW_50,50,50,0.8,6,12,6,20
WW_50,50,50,0.8,7,14,8,22
WW_50,50,50,0.8,8,16,8,26
WW_50,50,50,0.8,9,18,10,28
WW_50,50,50,0.8,10,20,12,30
WW_50,50,50,0.8,11,22,14,32
WW_50,50,50,0.8,12,24,16,34
WW_50,50,50,0.8,13,26,16,36
WW_50,50,50,0.8,14,28,18,40
WW_50,50,50,0.8,15,30,20,42
WW_50,50,50,0.8,16,32,22,44
WW_50,50,50,0.8,17,34,24,46
WW_50,50,50,0.8,18,36,26,48
WW_50,50,50,0.8,19,38,28,50
WW_50,50,50,0.8,20,40,28,52
WW_50,50,50,0.8,21,42,30,54
WW_50,50,50,0.8,22,44,32,56
WW_50,50,50,0.8,23,46,34,58
WW_50,50,50,0.8,24,48,36,60
WW_50,50,50,0.8,25,50,38,62
WW_50,50,50,0.8,26,52,40,64
WW_50,50,50,0.8,27,54,42,66
WW_50,50,50,0.8,28,56,44,68
WW_50,50,50,0.8,29,58,46,70
WW_50,50,50,0.8,30,60,48,72
WW_50,50,50,0.8,31,62,50,72
WW_50,50,50,0.8,32,64,52,74
WW_50,50,50,0.8,33,66,54,76
WW_50,50,50,0.8,34,68,56,78
WW_50,50,50,0.8,35,70,58,80
WW_50,50,50,0.8,36,72,60,82
WW_50,50,50,0.8,37,74,64,84
WW_50,50,50,0.8,38,76,66,84
WW_50,50,50,0.8,39,78,68,86
WW_50,50,50,0.8,40,80,70,88
WW_50,50,50,0.8,41,82,72,90
WW_50,50,50,0.8,42,84,74,92
WW_50,50,50,0.8,43,86,78,92
WW_50,50,50,0.8,44,88,80,94
WW_50,50,50,0.8,45,90,82,96
WW_50,50,50,0.8,46,92,84,96
WW_50,50,50,0.8,47,94,88,98
WW_50,50,50,0.8,48,96,90,98
WW_50,50,50,0.8,49,98,94,100
WW_50,50,50,0.8,50,100,98,100
Phoneme_25,62.5,75,0.8,0,0,0,1.3
Phoneme_25,62.5,75,0.8,1,1.3,0,5.3
Phoneme_25,62.5,75,0.8,2,2.7,1.3,6.7
Phoneme_25,62.5,75,0.8,3,4,1.3,9.3
Phoneme_25,62.5,75,0.8,4,5.3,1.3,10.7
Phoneme_25,62.5,75,0.8,5,6.7,2.7,13.3
Phoneme_25,62.5,75,0.8,6,8,4,14.7
Phoneme_25,62.5,75,0.8,7,9.3,4,16
Phoneme_25,62.5,75,0.8,8,10.7,5.3,18.7
Phoneme_25,62.5,75,0.8,9,12,6.7,20
Phoneme_25,62.5,75,0.8,10,13.3,6.7,21.3
Phoneme_25,62.5,75,0.8,11,14.7,8,22.7
Phoneme_25,62.5,75,0.8,12,16,9.3,24
Phoneme_25,62.5,75,0.8,13,17.3,10.7,26.7
Phoneme_25,62.5,75,0.8,14,18.7,10.7,28
Phoneme_25,62.5,75,0.8,15,20,12,29.3
Phoneme_25,62.5,75,0.8,16,21.3,13.3,30.7
Phoneme_25,62.5,75,0.8,17,22.7,14.7,32
Phoneme_25,62.5,75,0.8,18,24,16,33.3
Phoneme_25,62.5,75,0.8,19,25.3,17.3,34.7
Phoneme_25,62.5,75,0.8,20,26.7,17.3,36
Phoneme_25,62.5,75,0.8,21,28,18.7,38.7
Phoneme_25,62.5,75,0.8,22,29.3,20,40
Phoneme_25,62.5,75,0.8,23,30.7,21.3,41.3
Phoneme_25,62.5,75,0.8,24,32,22.7,42.7
Phoneme_25,62.5,75,0.8,25,33.3,24,44
Phoneme_25,62.5,75,0.8,26,34.7,25.3,45.3
Phoneme_25,62.5,75,0.8,27,36,26.7,46.7
Phoneme_25,62.5,75,0.8,28,37.3,28,48
Phoneme_25,62.5,75,0.8,29,38.7,28,49.3
Phoneme_25,62.5,75,0.8,30,40,29.3,50.7
Phoneme_25,62.5,75,0.8,31,41.3,30.7,52
Phoneme_25,62.5,75,0.8,32,42.7,32,53.3
Phoneme_25,62.5,75,0.8,33,44,33.3,54.7
Phoneme_25,62.5,75,0.8,34,45.3,34.7,56
Phoneme_25,62.5,75,0.8,35,46.7,36,57.3
Phoneme_25,62.5,75,0.8,36,48,37.3,58.7
Phoneme_25,62.5,75,0.8,37,49.3,38.7,60
Phoneme_25,62.5,75,0.8,38,50.7,40,61.3
Phoneme_25,62.5,75,0.8,39,52,41.3,62.7
Phoneme_25,62.5,75,0.8,40,53.3,42.7,64
Phoneme_25,62.5,75,0.8,41,54.7,44,65.3
Phoneme_25,62.5,75,0.8,42,56,45.3,66.7
Phoneme_25,62.5,75,0.8,43,57.3,46.7,68
Phoneme_25,62.5,75,0.8,44,58.7,48,69.3
Phoneme_25,62.5,75,0.8,45,60,49.3,70.7
Phoneme_25,62.5,75,0.8,46,61.3,50.7,72
Phoneme_25,62.5,75,0.8,47,62.7,52,72
Phoneme_25,62.5,75,0.8,48,64,53.3,73.3
Phoneme_25,62.5,75,0.8,49,65.3,54.7,74.7
Phoneme_25,62.5,75,0.8,50,66.7,56,76
Phoneme_25,62.5,75,0.8,51,68,57.3,77.3
Phoneme_25,62.5,75,0.8,52,69.3,58.7,78.7
Phoneme_25,62.5,75,0.8,53,70.7,60,80
Phoneme_25,62.5,75,0.8,54,72,61.3,81.3
Phoneme_25,62.5,75,0.8,55,73.3,64,82.7
Phoneme_25,62.5,75,0.8,56,74.7,65.3,82.7
Phoneme_25,62.5,75,0.8,57,76,66.7,84
Phoneme_25,62.5,75,0.8,58,77.3,68,85.3
Phoneme_25,62.5,75,0.8,59,78.7,69.3,86.7
Phoneme_25,62.5,75,0.8,60,80,70.7,88
Phoneme_25,62.5,75,0.8,61,81.3,72,89.3
Phoneme_25,62.5,75,0.8,62,82.7,73.3,89.3
Phoneme_25,62.5,75,0.8,63,84,76,90.7
Phoneme_25,62.5,75,0.8,64,85.3,77.3,92
Phoneme_25,62.5,75,0.8,65,86.7,78.7,93.3
Phoneme_25,62.5,75,0.8,66,88,80,93.3
Phoneme_25,62.5,75,0.8,67,89.3,81.3,94.7
Phoneme_25,62.5,75,0.8,68,90.7,84,96
Phoneme_25,62.5,75,0.8,69,92,85.3,96
Phoneme_25,62.5,75,0.8,70,93.3,86.7,97.3
Phoneme_25,62.5,75,0.8,71,94.7,89.3,98.7
Phoneme_25,62.5,75,0.8,72,96,90.7,98.7
Phoneme_25,62.5,75,0.8,73,97.3,93.3,98.7
Phoneme_25,62.5,75,0.8,74,98.7,94.7,100
Phoneme_25,62.5,75,0.8,75,100,98.7,100
Phoneme_50,125,150,0.8,0,0,0,0.7
Phoneme_50,125,150,0.8,1,0.7,0,2.7
Phoneme_50,125,150,0.8,2,1.3,0.7,3.3
Phoneme_50,125,150,0.8,3,2,0.7,4.7
Phoneme_50,125,150,0.8,4,2.7,0.7,5.3
Phoneme_50,125,150,0.8,5,3.3,1.3,6.7
Phoneme_50,125,150,0.8,6,4,2,7.3
Phoneme_50,125,150,0.8,7,4.7,2,8.7
Phoneme_50,125,150,0.8,8,5.3,2.7,9.3
Phoneme_50,125,150,0.8,9,6,3.3,10
Phoneme_50,125,150,0.8,10,6.7,3.3,10.7
Phoneme_50,125,150,0.8,11,7.3,4,12
Phoneme_50,125,150,0.8,12,8,4.7,12.7
Phoneme_50,125,150,0.8,13,8.7,4.7,13.3
Phoneme_50,125,150,0.8,14,9.3,5.3,14
Phoneme_50,125,150,0.8,15,10,6,15.3
Phoneme_50,125,150,0.8,16,10.7,6.7,16
Phoneme_50,125,150,0.8,17,11.3,7.3,16.7
Phoneme_50,125,150,0.8,18,12,7.3,17.3
Phoneme_50,125,150,0.8,19,12.7,8,18
Phoneme_50,125,150,0.8,20,13.3,8.7,18.7
Phoneme_50,125,150,0.8,21,14,9.3,20
Phoneme_50,125,150,0.8,22,14.7,10,20.7
Phoneme_50,125,150,0.8,23,15.3,10,21.3
Phoneme_50,125,150,0.8,24,16,10.7,22
Phoneme_50,125,150,0.8,25,16.7,11.3,22.7
Phoneme_50,125,150,0.8,26,17.3,12,23.3
Phoneme_50,125,150,0.8,27,18,12.7,24
Phoneme_50,125,150,0.8,28,18.7,13.3,25.3
Phoneme_50,125,150,0.8,29,19.3,14,26
Phoneme_50,125,150,0.8,30,20,14,26.7
Phoneme_50,125,150,0.8,31,20.7,14.7,27.3
Phoneme_50,125,150,0.8,32,21.3,15.3,28
Phoneme_50,125,150,0.8,33,22,16,28.7
Phoneme_50,125,150,0.8,34,22.7,16.7,29.3
Phoneme_50,125,150,0.8,35,23.3,17.3,30
Phoneme_50,125,150,0.8,36,24,18,30.7
Phoneme_50,125,150,0.8,37,24.7,18.7,31.3
Phoneme_50,125,150,0.8,38,25.3,18.7,32
Phoneme_50,125,150,0.8,39,26,19.3,33.3
Phoneme_50,125,150,0.8,40,26.7,20,34
Phoneme_50,125,150,0.8,41,27.3,20.7,34.7
Phoneme_50,125,150,0.8,42,28,21.3,35.3
Phoneme_50,125,150,0.8,43,28.7,22,36
Phoneme_50,125,150,0.8,44,29.3,22.7,36.7
Phoneme_50,125,150,0.8,45,30,23.3,37.3
Phoneme_50,125,150,0.8,46,30.7,24,38
Phoneme_50,125,150,0.8,47,31.3,24.7,38.7
Phoneme_50,125,150,0.8,48,32,25.3,39.3
Phoneme_50,125,150,0.8,49,32.7,26,40
Phoneme_50,125,150,0.8,50,33.3,26,40.7
Phoneme_50,125,150,0.8,51,34,26.7,41.3
Phoneme_50,125,150,0.8,52,34.7,27.3,42
Phoneme_50,125,150,0.8,53,35.3,28,42.7
Phoneme_50,125,150,0.8,54,36,28.7,43.3
Phoneme_50,125,150,0.8,55,36.7,29.3,44
Phoneme_50,125,150,0.8,56,37.3,30,44.7
Phoneme_50,125,150,0.8,57,38,30.7,45.3
Phoneme_50,125,150,0.8,58,38.7,31.3,46
Phoneme_50,125,150,0.8,59,39.3,32,47.3
Phoneme_50,125,150,0.8,60,40,32.7,48
Phoneme_50,125,150,0.8,61,40.7,33.3,48.7
Phoneme_50,125,150,0.8,62,41.3,34,49.3
Phoneme_50,125,150,0.8,63,42,34.7,50
Phoneme_50,125,150,0.8,64,42.7,35.3,50.7
Phoneme_50,125,150,0.8,65,43.3,36,51.3
Phoneme_50,125,150,0.8,66,44,36.7,52
Phoneme_50,125,150,0.8,67,44.7,37.3,52.7
Phoneme_50,125,150,0.8,68,45.3,38,53.3
Phoneme_50,125,150,0.8,69,46,38.7,54
Phoneme_50,125,150,0.8,70,46.7,39.3,54.7
Phoneme_50,125,150,0.8,71,47.3,39.3,55.3
Phoneme_50,125,150,0.8,72,48,40,56
Phoneme_50,125,150,0.8,73,48.7,40.7,56.7
Phoneme_50,125,150,0.8,74,49.3,41.3,57.3
Phoneme_50,125,150,0.8,75,50,42,58
Phoneme_50,125,150,0.8,76,50.7,42.7,58.7
Phoneme_50,125,150,0.8,77,51.3,43.3,59.3
Phoneme_50,125,150,0.8,78,52,44,59.3
Phoneme_50,125,150,0.8,79,52.7,44.7,60.7
Phoneme_50,125,150,0.8,80,53.3,45.3,60.7
Phoneme_50,125,150,0.8,81,54,46,61.3
Phoneme_50,125,150,0.8,82,54.7,46.7,62
Phoneme_50,125,150,0.8,83,55.3,47.3,62.7
Phoneme_50,125,150,0.8,84,56,48,63.3
Phoneme_50,125,150,0.8,85,56.7,48.7,64
Phoneme_50,125,150,0.8,86,57.3,49.3,64.7
Phoneme_50,125,150,0.8,87,58,50,65.3
Phoneme_50,125,150,0.8,88,58.7,50.7,66
Phoneme_50,125,150,0.8,89,59.3,51.3,66.7
Phoneme_50,125,150,0.8,90,60,52.7,67.3
Phoneme_50,125,150,0.8,91,60.7,52.7,68
Phoneme_50,125,150,0.8,92,61.3,54,68.7
Phoneme_50,125,150,0.8,93,62,54.7,69.3
Phoneme_50,125,150,0.8,94,62.7,55.3,70
Phoneme_50,125,150,0.8,95,63.3,56,70.7
Phoneme_50,125,150,0.8,96,64,56.7,71.3
Phoneme_50,125,150,0.8,97,64.7,57.3,72
Phoneme_50,125,150,0.8,98,65.3,58,72.7
Phoneme_50,125,150,0.8,99,66,58.7,73.3
Phoneme_50,125,150,0.8,100,66.7,59.3,74
Phoneme_50,125,150,0.8,101,67.3,60,74
Phoneme_50,125,150,0.8,102,68,60.7,74.7
Phoneme_50,125,150,0.8,103,68.7,61.3,75.3
Phoneme_50,125,150,0.8,104,69.3,62,76
Phoneme_50,125,150,0.8,105,70,62.7,76.7
Phoneme_50,125,150,0.8,106,70.7,63.3,77.3
Phoneme_50,125,150,0.8,107,71.3,64,78
Phoneme_50,125,150,0.8,108,72,64.7,78.7
Phoneme_50,125,150,0.8,109,72.7,65.3,79.3
Phoneme_50,125,150,0.8,110,73.3,66,80
Phoneme_50,125,150,0.8,111,74,66.7,80.7
Phoneme_50,125,150,0.8,112,74.7,68,81.3
Phoneme_50,125,150,0.8,113,75.3,68.7,81.3
Phoneme_50,125,150,0.8,114,76,69.3,82
Phoneme_50,125,150,0.8,115,76.7,70,82.7
Phoneme_50,125,150,0.8,116,77.3,70.7,83.3
Phoneme_50,125,150,0.8,117,78,71.3,84
Phoneme_50,125,150,0.8,118,78.7,72,84.7
Phoneme_50,125,150,0.8,119,79.3,72.7,85.3
Phoneme_50,125,150,0.8,120,80,73.3,86
Phoneme_50,125,150,0.8,121,80.7,74,86
Phoneme_50,125,150,0.8,122,81.3,74.7,86.7
Phoneme_50,125,150,0.8,123,82,76,87.3
Phoneme_50,125,150,0.8,124,82.7,76.7,88
Phoneme_50,125,150,0.8,125,83.3,77.3,88.7
Phoneme_50,125,150,0.8,126,84,78,89.3
Phoneme_50,125,150,0.8,127,84.7,78.7,90
Phoneme_50,125,150,0.8,128,85.3,79.3,90
Phoneme_50,125,150,0.8,129,86,80,90.7
Phoneme_50,125,150,0.8,130,86.7,81.3,91.3
Phoneme_50,125,150,0.8,131,87.3,82,92
Phoneme_50,125,150,0.8,132,88,82.7,92.7
Phoneme_50,125,150,0.8,133,88.7,83.3,92.7
Phoneme_50,125,150,0.8,134,89.3,84,93.3
Phoneme_50,125,150,0.8,135,90,84.7,94
Phoneme_50,125,150,0.8,136,90.7,86,94.7
Phoneme_50,125,150,0.8,137,91.3,86.7,95.3
Phoneme_50,125,150,0.8,138,92,87.3,95.3
Phoneme_50,125,150,0.8,139,92.7,88,96
Phoneme_50,125,150,0.8,140,93.3,89.3,96.7
Phoneme_50,125,150,0.8,141,94,90,96.7
Phoneme_50,125,150,0.8,142,94.7,90.7,97.3
Phoneme_50,125,150,0.8,143,95.3,91.3,98
Phoneme_50,125,150,0.8,144,96,92.7,98
Phoneme_50,125,150,0.8,145,96.7,93.3,98.7
Phoneme_50,125,150,0.8,146,97.3,94.7,99.3
Phoneme_50,125,150,0.8,147,98,95.3,99.3
Phoneme_50,125,150,0.8,148,98.7,96.7,99.3
Phoneme_50,125,150,0.8,149,99.3,97.3,100
Phoneme_50,125,150,0.8,150,100,99.3,100`;

const RAW_CSV_95 = `Scenario,N_Effective,Score_Scale_Max,Confidence_Level,Raw_Score,Score_Percent,Lower_Limit_Percent,Upper_Limit_Percent
WW_10,10,10,0.95,0,0,0,20
WW_10,10,10,0.95,1,10,0,40
WW_10,10,10,0.95,2,20,0,50
WW_10,10,10,0.95,3,30,10,70
WW_10,10,10,0.95,4,40,10,70
WW_10,10,10,0.95,5,50,20,80
WW_10,10,10,0.95,6,60,30,90
WW_10,10,10,0.95,7,70,30,90
WW_10,10,10,0.95,8,80,50,100
WW_10,10,10,0.95,9,90,60,100
WW_10,10,10,0.95,10,100,80,100
WW_25,25,25,0.95,0,0,0,12
WW_25,25,25,0.95,1,4,0,20
WW_25,25,25,0.95,2,8,0,28
WW_25,25,25,0.95,3,12,0,32
WW_25,25,25,0.95,4,16,4,40
WW_25,25,25,0.95,5,20,4,44
WW_25,25,25,0.95,6,24,8,48
WW_25,25,25,0.95,7,28,8,52
WW_25,25,25,0.95,8,32,12,56
WW_25,25,25,0.95,9,36,16,60
WW_25,25,25,0.95,10,40,16,64
WW_25,25,25,0.95,11,44,20,68
WW_25,25,25,0.95,12,48,24,72
WW_25,25,25,0.95,13,52,28,76
WW_25,25,25,0.95,14,56,32,80
WW_25,25,25,0.95,15,60,36,84
WW_25,25,25,0.95,16,64,40,84
WW_25,25,25,0.95,17,68,44,88
WW_25,25,25,0.95,18,72,48,92
WW_25,25,25,0.95,19,76,52,92
WW_25,25,25,0.95,20,80,56,96
WW_25,25,25,0.95,21,84,60,96
WW_25,25,25,0.95,22,88,68,100
WW_25,25,25,0.95,23,92,72,100
WW_25,25,25,0.95,24,96,80,100
WW_25,25,25,0.95,25,100,88,100
Phoneme_10,25,30,0.95,0,0,0,13.3
Phoneme_10,25,30,0.95,1,3.3,0,20
Phoneme_10,25,30,0.95,2,6.7,0,23.3
Phoneme_10,25,30,0.95,3,10,0,30
Phoneme_10,25,30,0.95,4,13.3,0,33.3
Phoneme_10,25,30,0.95,5,16.7,3.3,40
Phoneme_10,25,30,0.95,6,20,3.3,43.3
Phoneme_10,25,30,0.95,7,23.3,6.7,46.7
Phoneme_10,25,30,0.95,8,26.7,10,50
Phoneme_10,25,30,0.95,9,30,10,53.3
Phoneme_10,25,30,0.95,10,33.3,13.3,56.7
Phoneme_10,25,30,0.95,11,36.7,16.7,60
Phoneme_10,25,30,0.95,12,40,16.7,66.7
Phoneme_10,25,30,0.95,13,43.3,20,66.7
Phoneme_10,25,30,0.95,14,46.7,23.3,70
Phoneme_10,25,30,0.95,15,50,26.7,73.3
Phoneme_10,25,30,0.95,16,53.3,30,76.7
Phoneme_10,25,30,0.95,17,56.7,33.3,80
Phoneme_10,25,30,0.95,18,60,36.7,83.3
Phoneme_10,25,30,0.95,19,63.3,40,83.3
Phoneme_10,25,30,0.95,20,66.7,40,86.7
Phoneme_10,25,30,0.95,21,70,46.7,90
Phoneme_10,25,30,0.95,22,73.3,50,90
Phoneme_10,25,30,0.95,23,76.7,53.3,93.3
Phoneme_10,25,30,0.95,24,80,56.7,96.7
Phoneme_10,25,30,0.95,25,83.3,60,96.7
Phoneme_10,25,30,0.95,26,86.7,66.7,100
Phoneme_10,25,30,0.95,27,90,70,100
Phoneme_10,25,30,0.95,28,93.3,76.7,100
Phoneme_10,25,30,0.95,29,96.7,80,100
Phoneme_10,25,30,0.95,30,100,86.7,100
WW_50,50,50,0.95,0,0,0,6
WW_50,50,50,0.95,1,2,0,10
WW_50,50,50,0.95,2,4,0,14
WW_50,50,50,0.95,3,6,0,18
WW_50,50,50,0.95,4,8,2,20
WW_50,50,50,0.95,5,10,2,24
WW_50,50,50,0.95,6,12,4,26
WW_50,50,50,0.95,7,14,4,28
WW_50,50,50,0.95,8,16,6,32
WW_50,50,50,0.95,9,18,6,34
WW_50,50,50,0.95,10,20,8,36
WW_50,50,50,0.95,11,22,10,38
WW_50,50,50,0.95,12,24,10,42
WW_50,50,50,0.95,13,26,12,44
WW_50,50,50,0.95,14,28,14,46
WW_50,50,50,0.95,15,30,16,48
WW_50,50,50,0.95,16,32,16,50
WW_50,50,50,0.95,17,34,18,52
WW_50,50,50,0.95,18,36,20,54
WW_50,50,50,0.95,19,38,22,56
WW_50,50,50,0.95,20,40,24,58
WW_50,50,50,0.95,21,42,24,60
WW_50,50,50,0.95,22,44,26,62
WW_50,50,50,0.95,23,46,28,64
WW_50,50,50,0.95,24,48,30,66
WW_50,50,50,0.95,25,50,32,68
WW_50,50,50,0.95,26,52,34,70
WW_50,50,50,0.95,27,54,36,72
WW_50,50,50,0.95,28,56,38,74
WW_50,50,50,0.95,29,58,40,76
WW_50,50,50,0.95,30,60,42,76
WW_50,50,50,0.95,31,62,44,78
WW_50,50,50,0.95,32,64,46,80
WW_50,50,50,0.95,33,66,48,82
WW_50,50,50,0.95,34,68,50,84
WW_50,50,50,0.95,35,70,52,84
WW_50,50,50,0.95,36,72,54,86
WW_50,50,50,0.95,37,74,56,88
WW_50,50,50,0.95,38,76,58,90
WW_50,50,50,0.95,39,78,62,90
WW_50,50,50,0.95,40,80,64,92
WW_50,50,50,0.95,41,82,66,94
WW_50,50,50,0.95,42,84,68,94
WW_50,50,50,0.95,43,86,72,96
WW_50,50,50,0.95,44,88,74,96
WW_50,50,50,0.95,45,90,76,98
WW_50,50,50,0.95,46,92,80,98
WW_50,50,50,0.95,47,94,82,100
WW_50,50,50,0.95,48,96,86,100
WW_50,50,50,0.95,49,98,90,100
WW_50,50,50,0.95,50,100,94,100
Phoneme_25,62.5,75,0.95,0,0,0,5.3
Phoneme_25,62.5,75,0.95,1,1.3,0,8
Phoneme_25,62.5,75,0.95,2,2.7,0,10.7
Phoneme_25,62.5,75,0.95,3,4,0,13.3
Phoneme_25,62.5,75,0.95,4,5.3,0,14.7
Phoneme_25,62.5,75,0.95,5,6.7,1.3,17.3
Phoneme_25,62.5,75,0.95,6,8,1.3,18.7
Phoneme_25,62.5,75,0.95,7,9.3,2.7,21.3
Phoneme_25,62.5,75,0.95,8,10.7,2.7,22.7
Phoneme_25,62.5,75,0.95,9,12,4,25.3
Phoneme_25,62.5,75,0.95,10,13.3,4,26.7
Phoneme_25,62.5,75,0.95,11,14.7,5.3,28
Phoneme_25,62.5,75,0.95,12,16,6.7,29.3
Phoneme_25,62.5,75,0.95,13,17.3,6.7,32
Phoneme_25,62.5,75,0.95,14,18.7,8,33.3
Phoneme_25,62.5,75,0.95,15,20,9.3,34.7
Phoneme_25,62.5,75,0.95,16,21.3,9.3,36
Phoneme_25,62.5,75,0.95,17,22.7,10.7,37.3
Phoneme_25,62.5,75,0.95,18,24,12,40
Phoneme_25,62.5,75,0.95,19,25.3,12,41.3
Phoneme_25,62.5,75,0.95,20,26.7,13.3,42.7
Phoneme_25,62.5,75,0.95,21,28,14.7,44
Phoneme_25,62.5,75,0.95,22,29.3,16,45.3
Phoneme_25,62.5,75,0.95,23,30.7,17.3,46.7
Phoneme_25,62.5,75,0.95,24,32,17.3,48
Phoneme_25,62.5,75,0.95,25,33.3,18.7,49.3
Phoneme_25,62.5,75,0.95,26,34.7,20,50.7
Phoneme_25,62.5,75,0.95,27,36,21.3,52
Phoneme_25,62.5,75,0.95,28,37.3,22.7,53.3
Phoneme_25,62.5,75,0.95,29,38.7,24,54.7
Phoneme_25,62.5,75,0.95,30,40,24,56
Phoneme_25,62.5,75,0.95,31,41.3,25.3,57.3
Phoneme_25,62.5,75,0.95,32,42.7,26.7,58.7
Phoneme_25,62.5,75,0.95,33,44,28,60
Phoneme_25,62.5,75,0.95,34,45.3,29.3,61.3
Phoneme_25,62.5,75,0.95,35,46.7,30.7,62.7
Phoneme_25,62.5,75,0.95,36,48,32,64
Phoneme_25,62.5,75,0.95,37,49.3,33.3,65.3
Phoneme_25,62.5,75,0.95,38,50.7,34.7,66.7
Phoneme_25,62.5,75,0.95,39,52,36,68
Phoneme_25,62.5,75,0.95,40,53.3,37.3,69.3
Phoneme_25,62.5,75,0.95,41,54.7,38.7,70.7
Phoneme_25,62.5,75,0.95,42,56,40,72
Phoneme_25,62.5,75,0.95,43,57.3,41.3,73.3
Phoneme_25,62.5,75,0.95,44,58.7,42.7,74.7
Phoneme_25,62.5,75,0.95,45,60,44,76
Phoneme_25,62.5,75,0.95,46,61.3,45.3,76
Phoneme_25,62.5,75,0.95,47,62.7,46.7,77.3
Phoneme_25,62.5,75,0.95,48,64,48,78.7
Phoneme_25,62.5,75,0.95,49,65.3,49.3,80
Phoneme_25,62.5,75,0.95,50,66.7,50.7,81.3
Phoneme_25,62.5,75,0.95,51,68,52,82.7
Phoneme_25,62.5,75,0.95,52,69.3,53.3,82.7
Phoneme_25,62.5,75,0.95,53,70.7,54.7,84
Phoneme_25,62.5,75,0.95,54,72,56,85.3
Phoneme_25,62.5,75,0.95,55,73.3,57.3,86.7
Phoneme_25,62.5,75,0.95,56,74.7,58.7,88
Phoneme_25,62.5,75,0.95,57,76,60,88
Phoneme_25,62.5,75,0.95,58,77.3,62.7,89.3
Phoneme_25,62.5,75,0.95,59,78.7,64,90.7
Phoneme_25,62.5,75,0.95,60,80,65.3,90.7
Phoneme_25,62.5,75,0.95,61,81.3,66.7,92
Phoneme_25,62.5,75,0.95,62,82.7,68,93.3
Phoneme_25,62.5,75,0.95,63,84,70.7,93.3
Phoneme_25,62.5,75,0.95,64,85.3,72,94.7
Phoneme_25,62.5,75,0.95,65,86.7,73.3,96
Phoneme_25,62.5,75,0.95,66,88,74.7,96
Phoneme_25,62.5,75,0.95,67,89.3,77.3,97.3
Phoneme_25,62.5,75,0.95,68,90.7,78.7,97.3
Phoneme_25,62.5,75,0.95,69,92,81.3,98.7
Phoneme_25,62.5,75,0.95,70,93.3,82.7,98.7
Phoneme_25,62.5,75,0.95,71,94.7,85.3,100
Phoneme_25,62.5,75,0.95,72,96,86.7,100
Phoneme_25,62.5,75,0.95,73,97.3,89.3,100
Phoneme_25,62.5,75,0.95,74,98.7,92,100
Phoneme_25,62.5,75,0.95,75,100,94.7,100
Phoneme_50,125,150,0.95,0,0,0,2.7
Phoneme_50,125,150,0.95,1,0.7,0,4
Phoneme_50,125,150,0.95,2,1.3,0,5.3
Phoneme_50,125,150,0.95,3,2,0,6.7
Phoneme_50,125,150,0.95,4,2.7,0,8
Phoneme_50,125,150,0.95,5,3.3,0.7,8.7
Phoneme_50,125,150,0.95,6,4,0.7,10
Phoneme_50,125,150,0.95,7,4.7,1.3,10.7
Phoneme_50,125,150,0.95,8,5.3,1.3,12
Phoneme_50,125,150,0.95,9,6,2,12.7
Phoneme_50,125,150,0.95,10,6.7,2,14
Phoneme_50,125,150,0.95,11,7.3,2.7,14.7
Phoneme_50,125,150,0.95,12,8,2.7,15.3
Phoneme_50,125,150,0.95,13,8.7,3.3,16.7
Phoneme_50,125,150,0.95,14,9.3,4,17.3
Phoneme_50,125,150,0.95,15,10,4,18
Phoneme_50,125,150,0.95,16,10.7,4.7,19.3
Phoneme_50,125,150,0.95,17,11.3,5.3,20
Phoneme_50,125,150,0.95,18,12,5.3,20.7
Phoneme_50,125,150,0.95,19,12.7,6,21.3
Phoneme_50,125,150,0.95,20,13.3,6.7,22.7
Phoneme_50,125,150,0.95,21,14,6.7,23.3
Phoneme_50,125,150,0.95,22,14.7,7.3,24
Phoneme_50,125,150,0.95,23,15.3,8,24.7
Phoneme_50,125,150,0.95,24,16,8.7,26
Phoneme_50,125,150,0.95,25,16.7,8.7,26.7
Phoneme_50,125,150,0.95,26,17.3,9.3,27.3
Phoneme_50,125,150,0.95,27,18,10,28
Phoneme_50,125,150,0.95,28,18.7,10.7,28.7
Phoneme_50,125,150,0.95,29,19.3,10.7,29.3
Phoneme_50,125,150,0.95,30,20,11.3,30.7
Phoneme_50,125,150,0.95,31,20.7,12,31.3
Phoneme_50,125,150,0.95,32,21.3,12.7,32
Phoneme_50,125,150,0.95,33,22,13.3,32.7
Phoneme_50,125,150,0.95,34,22.7,13.3,33.3
Phoneme_50,125,150,0.95,35,23.3,14,34
Phoneme_50,125,150,0.95,36,24,14.7,34.7
Phoneme_50,125,150,0.95,37,24.7,15.3,35.3
Phoneme_50,125,150,0.95,38,25.3,16,36.7
Phoneme_50,125,150,0.95,39,26,16,37.3
Phoneme_50,125,150,0.95,40,26.7,16.7,38
Phoneme_50,125,150,0.95,41,27.3,17.3,38.7
Phoneme_50,125,150,0.95,42,28,18,39.3
Phoneme_50,125,150,0.95,43,28.7,18.7,40
Phoneme_50,125,150,0.95,44,29.3,19.3,40.7
Phoneme_50,125,150,0.95,45,30,20,41.3
Phoneme_50,125,150,0.95,46,30.7,20,42
Phoneme_50,125,150,0.95,47,31.3,20.7,42.7
Phoneme_50,125,150,0.95,48,32,21.3,43.3
Phoneme_50,125,150,0.95,49,32.7,22,44.7
Phoneme_50,125,150,0.95,50,33.3,22.7,45.3
Phoneme_50,125,150,0.95,51,34,23.3,46
Phoneme_50,125,150,0.95,52,34.7,24,46.7
Phoneme_50,125,150,0.95,53,35.3,24.7,47.3
Phoneme_50,125,150,0.95,54,36,25.3,48
Phoneme_50,125,150,0.95,55,36.7,25.3,48.7
Phoneme_50,125,150,0.95,56,37.3,26,49.3
Phoneme_50,125,150,0.95,57,38,26.7,50
Phoneme_50,125,150,0.95,58,38.7,27.3,50.7
Phoneme_50,125,150,0.95,59,39.3,28,51.3
Phoneme_50,125,150,0.95,60,40,28.7,52
Phoneme_50,125,150,0.95,61,40.7,29.3,52.7
Phoneme_50,125,150,0.95,62,41.3,30,53.3
Phoneme_50,125,150,0.95,63,42,30.7,54
Phoneme_50,125,150,0.95,64,42.7,31.3,54.7
Phoneme_50,125,150,0.95,65,43.3,32,55.3
Phoneme_50,125,150,0.95,66,44,32.7,56
Phoneme_50,125,150,0.95,67,44.7,32.7,56.7
Phoneme_50,125,150,0.95,68,45.3,33.3,57.3
Phoneme_50,125,150,0.95,69,46,34,58
Phoneme_50,125,150,0.95,70,46.7,34.7,58.7
Phoneme_50,125,150,0.95,71,47.3,35.3,59.3
Phoneme_50,125,150,0.95,72,48,36,60
Phoneme_50,125,150,0.95,73,48.7,36.7,60.7
Phoneme_50,125,150,0.95,74,49.3,37.3,61.3
Phoneme_50,125,150,0.95,75,50,38,62
Phoneme_50,125,150,0.95,76,50.7,38.7,62.7
Phoneme_50,125,150,0.95,77,51.3,39.3,63.3
Phoneme_50,125,150,0.95,78,52,40,64
Phoneme_50,125,150,0.95,79,52.7,40.7,64.7
Phoneme_50,125,150,0.95,80,53.3,41.3,65.3
Phoneme_50,125,150,0.95,81,54,42,66
Phoneme_50,125,150,0.95,82,54.7,42.7,66.7
Phoneme_50,125,150,0.95,83,55.3,43.3,66.7
Phoneme_50,125,150,0.95,84,56,44,67.3
Phoneme_50,125,150,0.95,85,56.7,44.7,68
Phoneme_50,125,150,0.95,86,57.3,45.3,68.7
Phoneme_50,125,150,0.95,87,58,46,69.3
Phoneme_50,125,150,0.95,88,58.7,46.7,70
Phoneme_50,125,150,0.95,89,59.3,47.3,70.7
Phoneme_50,125,150,0.95,90,60,48,71.3
Phoneme_50,125,150,0.95,91,60.7,48.7,72
Phoneme_50,125,150,0.95,92,61.3,49.3,72.7
Phoneme_50,125,150,0.95,93,62,50,73.3
Phoneme_50,125,150,0.95,94,62.7,50.7,74
Phoneme_50,125,150,0.95,95,63.3,51.3,74.7
Phoneme_50,125,150,0.95,96,64,52,74.7
Phoneme_50,125,150,0.95,97,64.7,52.7,75.3
Phoneme_50,125,150,0.95,98,65.3,53.3,76
Phoneme_50,125,150,0.95,99,66,54,76.7
Phoneme_50,125,150,0.95,100,66.7,54.7,77.3
Phoneme_50,125,150,0.95,101,67.3,56,78
Phoneme_50,125,150,0.95,102,68,56.7,78.7
Phoneme_50,125,150,0.95,103,68.7,57.3,79.3
Phoneme_50,125,150,0.95,104,69.3,58,80
Phoneme_50,125,150,0.95,105,70,58.7,80
Phoneme_50,125,150,0.95,106,70.7,59.3,80.7
Phoneme_50,125,150,0.95,107,71.3,60,81.3
Phoneme_50,125,150,0.95,108,72,60.7,82
Phoneme_50,125,150,0.95,109,72.7,61.3,82.7
Phoneme_50,125,150,0.95,110,73.3,62,83.3
Phoneme_50,125,150,0.95,111,74,62.7,84
Phoneme_50,125,150,0.95,112,74.7,63.3,84
Phoneme_50,125,150,0.95,113,75.3,64.7,84.7
Phoneme_50,125,150,0.95,114,76,65.3,85.3
Phoneme_50,125,150,0.95,115,76.7,66,86
Phoneme_50,125,150,0.95,116,77.3,66.7,86.7
Phoneme_50,125,150,0.95,117,78,67.3,86.7
Phoneme_50,125,150,0.95,118,78.7,68,87.3
Phoneme_50,125,150,0.95,119,79.3,68.7,88
Phoneme_50,125,150,0.95,120,80,69.3,88.7
Phoneme_50,125,150,0.95,121,80.7,70.7,89.3
Phoneme_50,125,150,0.95,122,81.3,71.3,89.3
Phoneme_50,125,150,0.95,123,82,72,90
Phoneme_50,125,150,0.95,124,82.7,72.7,90.7
Phoneme_50,125,150,0.95,125,83.3,73.3,91.3
Phoneme_50,125,150,0.95,126,84,74,91.3
Phoneme_50,125,150,0.95,127,84.7,75.3,92
Phoneme_50,125,150,0.95,128,85.3,76,92.7
Phoneme_50,125,150,0.95,129,86,76.7,93.3
Phoneme_50,125,150,0.95,130,86.7,77.3,93.3
Phoneme_50,125,150,0.95,131,87.3,78.7,94
Phoneme_50,125,150,0.95,132,88,79.3,94.7
Phoneme_50,125,150,0.95,133,88.7,80,95.3
Phoneme_50,125,150,0.95,134,89.3,80.7,95.3
Phoneme_50,125,150,0.95,135,90,82,96
Phoneme_50,125,150,0.95,136,90.7,82.7,96
Phoneme_50,125,150,0.95,137,91.3,83.3,96.7
Phoneme_50,125,150,0.95,138,92,84.7,97.3
Phoneme_50,125,150,0.95,139,92.7,85.3,97.3
Phoneme_50,125,150,0.95,140,93.3,86,98
Phoneme_50,125,150,0.95,141,94,87.3,98
Phoneme_50,125,150,0.95,142,94.7,88,98.7
Phoneme_50,125,150,0.95,143,95.3,88.7,98.7
Phoneme_50,125,150,0.95,144,96,90,99.3
Phoneme_50,125,150,0.95,145,96.7,91.3,99.3
Phoneme_50,125,150,0.95,146,97.3,92,100
Phoneme_50,125,150,0.95,147,98,93.3,100
Phoneme_50,125,150,0.95,148,98.7,94.7,100
Phoneme_50,125,150,0.95,149,99.3,96,100
Phoneme_50,125,150,0.95,150,100,97.3,100`;

const parseCSV = (csv) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    const result = {};

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        if (row.length < 2) continue;

        const scenario = row[0];
        const confidence = row[3];
        const scoreMax = parseInt(row[2]);

        if (!result[scenario]) result[scenario] = { maxScore: scoreMax, confidenceLevels: {} };
        if (!result[scenario].confidenceLevels[confidence]) result[scenario].confidenceLevels[confidence] = [];

        result[scenario].confidenceLevels[confidence].push({
            raw: parseFloat(row[4]),
                                                           score: parseFloat(row[5]),
                                                           lower: parseFloat(row[6]),
                                                           upper: parseFloat(row[7]),
        });
    }
    return result;
};

// --- COMPONENT ---

const CriticalDifferenceApp = () => {
    const [data, setData] = useState(null);
    const [scenario, setScenario] = useState('WW_25'); // Default to 25 word list
    const [confidence, setConfidence] = useState('0.8');
    const [inputScore1, setInputScore1] = useState('');
    const [inputScore2, setInputScore2] = useState('');
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        // Parse the 80% data
        const data80 = parseCSV(RAW_CSV_80);
        // Parse the 95% data
        const data95 = parseCSV(RAW_CSV_95);

        // Merge datasets
        const merged = { ...data80 };
        Object.keys(data95).forEach(scenarioKey => {
            if (merged[scenarioKey]) {
                // Scenario exists, merge confidence levels
                merged[scenarioKey].confidenceLevels = {
                    ...merged[scenarioKey].confidenceLevels,
                    ...data95[scenarioKey].confidenceLevels
                };
            } else {
                // New scenario (unlikely given the data structure, but good practice)
                merged[scenarioKey] = data95[scenarioKey];
            }
        });

        setData(merged);
    }, []);

    // Compute visualization data for chart
    const currentDataset = useMemo(() => {
        if (!data || !data[scenario]) return [];
        return data[scenario].confidenceLevels[confidence] || [];
    }, [data, scenario, confidence]);

    const maxScore = useMemo(() => {
        return data && data[scenario] ? data[scenario].maxScore : 25;
    }, [data, scenario]);

    const formatScenarioName = (s) => {
        const parts = s.split('_');
        const label = parts[0] === 'WW' ? 'Word' : parts[0];
        return `${label} List (${parts[1]} items)`;
    };

    // Logic for finding the range for a specific input score
    const getRangeForScore = (rawScore) => {
        if (!currentDataset.length) return null;
        // Find exact match or closest
        // The data is discrete, so we look for the exact raw score
        const row = currentDataset.find(r => r.raw === parseInt(rawScore));
        return row || null;
    };

    const score1Details = useMemo(() => {
        if (inputScore1 === '' || isNaN(inputScore1)) return null;
        return getRangeForScore(inputScore1);
    }, [inputScore1, currentDataset]);

    const score2Details = useMemo(() => {
        if (inputScore2 === '' || isNaN(inputScore2)) return null;
        return getRangeForScore(inputScore2);
    }, [inputScore2, currentDataset]);

    // Comparison Logic
    const comparisonResult = useMemo(() => {
        if (!score1Details || !score2Details) return null;

        const s1 = score1Details;
        const s2 = score2Details;

        // Logic: Is Score 2 OUTSIDE the confidence interval of Score 1?
        // Note: Critical Difference tables can be asymmetrical. Standard practice is to check if the second score falls within the interval of the first.
        const isSignificant = s2.score < s1.lower || s2.score > s1.upper;

        return {
            significant: isSignificant,
            message: isSignificant
            ? "Significant Difference"
            : "No Significant Difference",
            details: isSignificant
            ? `Score 2 (${s2.score}%) is outside the ${confidence * 100}% CI of Score 1 ([${s1.lower}%, ${s1.upper}%]).`
            : `Score 2 (${s2.score}%) falls within the ${confidence * 100}% CI of Score 1 ([${s1.lower}%, ${s1.upper}%]).`
        };
    }, [score1Details, score2Details, confidence]);

    if (!data) return <div className="p-8 text-center">Loading Critical Difference Data...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900 font-sans p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between bg-white p-8 rounded-2xl shadow-lg border border-slate-200/50 backdrop-blur-sm">
        <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-xl">
        <TrendingUp className="w-7 h-7 text-white" />
        </div>
        Critical Difference Visualizer
        </h1>
        <p className="text-slate-600 mt-2 text-lg">Visualize confidence intervals for speech perception tests.</p>
        </div>
        <div className="mt-6 md:mt-0 flex gap-4 flex-wrap">
        <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-700">Test:</span>
        <select
        className="px-4 py-2.5 border-2 border-slate-200 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-slate-300 cursor-pointer shadow-sm"
        value={scenario}
        onChange={(e) => {
            setScenario(e.target.value);
            setInputScore1('');
            setInputScore2('');
        }}
        >
        {Object.keys(data).sort((a, b) => {
            const splitA = a.split('_');
            const splitB = b.split('_');
            // Force WW (Word) to come before Phoneme
            if (splitA[0] !== splitB[0]) return splitA[0] === 'WW' ? -1 : 1;
            // Sort numerically by count
            return parseInt(splitA[1]) - parseInt(splitB[1]);
        }).map(k => (
            <option key={k} value={k}>{formatScenarioName(k)}</option>
        ))}
        </select>
        </div>
        <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-700">Confidence:</span>
        <select
        className="px-4 py-2.5 border-2 border-slate-200 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-slate-300 cursor-pointer shadow-sm"
        value={confidence}
        onChange={(e) => setConfidence(e.target.value)}
        >
        {data[scenario] && Object.keys(data[scenario].confidenceLevels).sort().map(level => (
            <option key={level} value={level}>{parseInt(parseFloat(level) * 100)}%</option>
        ))}
        </select>
        </div>
        </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Visualization */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-xl border border-slate-200/50">
        <div className="flex justify-between items-start mb-6">
        <div>
        <h2 className="text-xl font-bold text-slate-800">Confidence Envelope</h2>
        <p className="text-sm text-slate-500 mt-1">Shaded area represents the range of non-significant difference</p>
        </div>
        </div>

        <div className="h-[450px] w-full bg-gradient-to-br from-slate-50/50 to-blue-50/30 rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
        data={currentDataset}
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
        dataKey="raw"
        type="number"
        domain={[0, maxScore]}
        label={{ value: 'Raw Score', position: 'insideBottom', offset: -10 }}
        tick={{fontSize: 12}}
        />
        <YAxis
        domain={[0, 100]}
        label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        formatter={(value, name) => [`${value}%`, name]}
        labelFormatter={(label) => `Raw Score: ${label}`}
        />
        <Legend verticalAlign="top" height={36}/>

        {/* Confidence Area */}
        <Area
        type="mo#818cf8"
        strokeWidth={1.5}
        fill="url(#colorGradient)"
        fillOpacity={0.6}
        name={`${parseInt(parseFloat(confidence) * 100)}% Confidence Interval`}
        />
        <Area
        type="monotone"
        dataKey="lower"
        stroke="none"
        fill="#fff"
        fillOpacity={1}
        />
        
        <defs>
        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.1}/>
        </linearGradient>
        </defs>

        {/* Main Score Line */}
        <Line
        type="monotone"
        dataKey="score"
        stroke="#4f46e5"
        strokeWidth={3}
        dot={false}
        name="Score Reference"
        />

        {/* User Points */}
        {score1Details && (
            <ReferenceDot
            x={score1Details.raw}
            y={score1Details.score}
            r={8}
            fill="#0ea5e9"
            stroke="#fff"
            strokeWidth={3}
            />
        )}
        {score2Details && (
            <ReferenceDot
            x={score2Details.raw}
            y={score2Details.score}
            r={8}
            fill="#f43f5e"
            stroke="#fff"
            strokeWidth={3}
            />
        )}

        {/* Lines for selected point visualization */}
        {score1Details && (
            <>
            <Line dataKey="upper" stroke="#94a3b8" strokeDasharray="3 3" dot={false} activeDot={false} legendType="none" />
            <Line dataKey="lower" stroke="#94a3b8" strokeDasharray="3 3" dot={false} activeDot={false} legendType="none" />
            </>
        )}

        </ComposedChart>
        </ResponsiveContainer>
        </div>
        </div>

        {/* Calculator / Inputs */}
        <div className="space-y-6">

        {/* Input 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200/50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
        <Calculator className="w-5 h-5 text-white" />
        </div>
        Score Lookup
        </h2>

        <div className="space-y-5">
        <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Baseline Raw Score (0-{maxScore})</label>
        <input
        type="number"
        min="0"
        max={maxScore}
        value={inputScore1}
        onChange={(e) => setInputScore1(e.target.value)}
        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg font-medium shadow-sm hover:border-slate-300"
        placeholder={`Enter score (0-${maxScore})`}
        />
        </div>

        {score1Details ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-100 space-y-3 shadow-sm">
            <div className="flex justify-between items-center border-b-2 border-blue-200 pb-3">
            <span className="text-slate-700 font-semibold">Score %</span>
            <span className="font-bold text-blue-600 text-2xl">{score1Details.score}%</span>
            </div>
            <div className="flex justify-between items-center pt-1">
            <span className="text-slate-600 font-medium">Lower Limit</span>
            <span className="font-bold text-slate-800 text-lg">{score1Details.lower}%</span>
            </div>
            <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Upper Limit</span>
            <span className="font-bold text-slate-800 text-lg">{score1Details.upper}%</span>
            </div>
            <div className="text-xs text-center text-blue-600 font-medium pt-2 bg-white/50 py-2 rounded-lg">
            {parseInt(parseFloat(confidence) * 100)}% Confidence Interval
            </div>
            </div>
        ) : (
            <div className="text-center text-sm text-slate-400 italic py-8 border-2 border-dashed border-slate-200 rounded-xl">
            Enter a valid score to see limits
            </div>
        )}
        </div>
        </div>

        {/* Comparison */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200/50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-2 rounded-lg">
        <AlertCircle className="w-5 h-5 text-white" />
        </div>
        Comparison
        </h2>

        <div className="space-y-5">
        <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Retest Raw Score (Optional)</label>
        <input
        type="number"
        min="0"
        max={maxScore}
        value={inputScore2}
        onChange={(e) => setInputScore2(e.target.value)}
        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all text-lg font-medium shadow-sm hover:border-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed"
        placeholder="Enter retest score"
        disabled={!score1Details}
        />
        </div>

        {comparisonResult && (
            <div className={`p-5 rounded-xl border-2 shadow-lg ${comparisonResult.significant ? 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200' : 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'}`}>
            <div className="flex items-start gap-4">
            {comparisonResult.significant ? (
                <div className="bg-rose-500 p-2 rounded-lg">
                <XCircle className="w-6 h-6 text-white" />
                </div>
            ) : (
                <div className="bg-emerald-500 p-2 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
            )}
            <div>
            <h3 className={`font-bold text-lg ${comparisonResult.significant ? 'text-rose-700' : 'text-emerald-700'}`}>
            {comparisonResult.message}
            </h3>
            <p className={`text-sm mt-2 leading-relaxed ${comparisonResult.significant ? 'text-rose-600' : 'text-emerald-600'}`}>
            {comparisonResult.details}
            </p>
            </div>
            </div>
            </div>
        )}
        </div>
        </div>

        </div>

        {/* Data Table View */}        </div>

        {/* Data Table View */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
        <button
        onClick={() => setShowTable(!showTable)}
        className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all"
        >
        <div className="flex items-center gap-3 font-bold text-slate-800 text-lg">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-2 rounded-lg">
        <Table className="w-5 h-5 text-white" />
        </div>
        {showTable ? 'Hide Data Table' : 'Show Full Data Table'}
        </div>
        <span className="text-3xl text-slate-400 font-light">{showTable ? '−' : '+'}</span>
        </button>

        {showTable && (
            <div className="overflow-x-auto p-6">
            <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-gradient-to-r from-slate-100 to-slate-50">
            <tr>
            <th className="px-6 py-4 font-bold">Raw Score</th>
            <th className="px-6 py-4 font-bold">Score %</th>
            <th className="px-6 py-4 font-bold">Lower Limit %</th>
            <th className="px-6 py-4 font-bold">Upper Limit %</th>
            </tr>
            </thead>
            <tbody>
            {currentDataset.map((row, index) => (
                <tr key={row.raw} className={`border-b hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                <td className="px-6 py-4 font-bold text-slate-900">{row.raw}</td>
                <td className="px-6 py-4 font-semibold text-indigo-600">{row.score}</td>
                <td className="px-6 py-4 font-semibold text-rose-600">{row.lower}</td>
                <td className="px-6 py-4 font-semibold text-emerald-600">{row.upper}</td>
                </tr>
            ))}
            </tbody>
            </table>
            </div>
        )}
        </div>

        <div className="flex gap-4 items-start bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-100 shadow-sm">
        <div className="bg-blue-500 p-2 rounded-lg">
        <Info className="w-5 h-5 flex-shrink-0 text-white" />
        </div>
        <p className="text-sm text-blue-900 leading-relaxed">
        <strong className="font-bold">Note:</strong> Choose between 80% and 95% Confidence Intervals using the dropdown menu.
        The confidence interval represents the range of scores within which a retest score is expected to fall if there is no true change in performance.
        </p>
        </div>

        </div>
        </div>
    );
};

export default CriticalDifferenceApp;
