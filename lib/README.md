# Heatmap Date Handling Guide

## Overview

This document explains the consistent date handling approach implemented across the application to ensure accurate heatmap visualization, streak calculations, and combined activity metrics.

## Key Components

### Date Formatting Utilities (`calendarUtils.ts`)

- `formatDateString(date)`: Converts a date (string or Date object) to standard YYYY-MM-DD format
- `normalizeDate(dateStr)`: Safely normalizes any date string format to YYYY-MM-DD

### Data Transformation (`transformData.ts`)

- Consistent date normalization at the source
- Robust error handling for invalid dates
- Timezone-safe date parsing

### Validation Utilities (`heatmapValidation.ts`)

- `validateHeatmapData()`: Helper function to check for date inconsistencies
- `findMissingDays()`: Identifies blank spots in the heatmap

## Common Issues Fixed

1. **Timezone Inconsistencies**: Dates are now normalized without timezone effects
2. **Blank Spaces in Heatmap**: Fixed by:

   - Consistent date string formatting
   - Proper grid calculation with accurate date mapping
   - Exact date matching for activity data

3. **Activity Combining Issues**: Resolved through:

   - Normalized date strings as Map keys
   - Consistent date formats across all components
   - Robust error handling

4. **Streak Calculation Fixes**:
   - Using normalized dates in streak calculations
   - Consistent date formatting for comparisons

## Best Practices

When modifying date-related functionality:

1. Always use the utility functions in `calendarUtils.ts` rather than direct date manipulation
2. Normalize dates before storing or comparing them
3. Use proper error handling for date parsing
4. When in doubt, use the validation utils to check for inconsistencies
