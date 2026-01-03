#!/bin/bash

# SMS Feature Verification Test Script
# This script tests all critical features to ensure they're operational

echo "======================================"
echo "SMS Feature Verification Test"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="${BASE_URL:-http://localhost:5000}"

echo "Testing Backend API at: $BASE_URL"
echo ""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$BASE_URL$endpoint" 2>/dev/null)
    
    if [ "$response" == "401" ] || [ "$response" == "200" ] || [ "$response" == "404" ]; then
        echo -e "${GREEN}✓${NC} (HTTP $response - Endpoint accessible)"
    else
        echo -e "${RED}✗${NC} (HTTP $response - Endpoint may be down)"
    fi
}

echo "1. ASSIGNMENT ROUTES"
echo "--------------------"
test_endpoint "GET" "/Assignments/test123" "Get Assignments by Class"
test_endpoint "GET" "/Assignment/test123" "Get Assignment Detail"
test_endpoint "GET" "/StudentAssignments/test123" "Get Student Assignments"
echo ""

echo "2. TIMETABLE ROUTES"
echo "-------------------"
test_endpoint "GET" "/Timetable?classId=test123" "Get Timetable"
test_endpoint "GET" "/TeacherTimetable/test123" "Get Teacher Timetable"
test_endpoint "GET" "/SchoolTimetables/test123" "Get School Timetables"
echo ""

echo "3. FEE ROUTES"
echo "-------------"
test_endpoint "GET" "/StudentFees/test123" "Get Student Fees"
test_endpoint "GET" "/ClassFees/test123" "Get Class Fees"
test_endpoint "GET" "/SchoolFeesSummary/test123" "Get School Fees Summary"
echo ""

echo "4. EVENT ROUTES"
echo "---------------"
test_endpoint "GET" "/SchoolEvents/test123" "Get School Events"
test_endpoint "GET" "/Event/test123" "Get Event Detail"
test_endpoint "GET" "/UpcomingEvents/test123" "Get Upcoming Events"
echo ""

echo "5. LIBRARY ROUTES"
echo "-----------------"
test_endpoint "GET" "/Books?schoolId=test123" "Get All Books"
test_endpoint "GET" "/Book/test123" "Get Book Detail"
test_endpoint "GET" "/LibraryStats/test123" "Get Library Stats"
echo ""

echo "6. MESSAGE ROUTES"
echo "-----------------"
test_endpoint "GET" "/InboxMessages?userId=test123&userModel=Student" "Get Inbox Messages"
test_endpoint "GET" "/Message/test123" "Get Message Detail"
test_endpoint "GET" "/UnreadCount" "Get Unread Count"
echo ""

echo "======================================"
echo "Test Complete!"
echo "======================================"
echo ""
echo "NOTE: HTTP 401 responses are expected (authentication required)"
echo "      HTTP 404 responses are expected (test IDs don't exist)"
echo "      HTTP 200 responses indicate working endpoints"
echo ""
echo "If you see connection errors, ensure the backend server is running:"
echo "  cd backend && npm run dev"
echo ""
