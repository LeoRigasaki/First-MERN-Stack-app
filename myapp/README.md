npm install \
@babel/plugin-proposal-private-property-in-object@7.21.11 \
@coreui/icons-react@2.2.1 \
@coreui/icons@3.0.1 \
@coreui/react@4.10.1 \
@emotion/react@11.11.1 \
@emotion/styled@11.11.0 \
@fullcalendar/core@6.1.9 \
@fullcalendar/daygrid@6.1.9 \
@fullcalendar/interaction@6.1.9 \
@fullcalendar/list@6.1.9 \
@fullcalendar/react@6.1.9 \
@fullcalendar/timegrid@6.1.9 \
@mui/icons-material@5.14.13 \
@mui/material@5.14.13 \
@mui/styled-engine-sc@5.14.10 \
@mui/x-data-grid@6.16.1 \
@nivo/bar@0.83.0 \
@nivo/geo@0.83.0 \
@nivo/line@0.83.0 \
@nivo/pie@0.83.0 \
@testing-library/jest-dom@5.17.0 \
@testing-library/react@13.4.0 \
@testing-library/user-event@13.5.0 \
bcrypt@5.1.1 \
cors@2.8.5 \
express@4.18.2 \
formik@2.4.5 \
jsonwebtoken@9.0.2 \
lowdb@6.0.1 \
react-dom@18.2.0 \
react-pro-sidebar@1.1.0-alpha.1 \
react-router-dom@6.16.0 \
react-scripts@5.0.1 \
react@18.2.0 \
styled-components@5.3.11 \
url@0.11.3 \
web-vitals@2.1.4 \
yup@1.3.2 \
react-spring

Test SignUp:
Invoke-WebRequest -Uri "http://localhost:8000/api/signup" -Method Post -ContentType "application/json" -Body '{
  "username": "user4",
  "email": "new_user@example.com",
  "password": "1234567"
}'
Test Login:
Invoke-WebRequest -Uri "http://localhost:8000/api/login" -Method Post -ContentType "application/json" -Body '{"username": "user1", "password": "password1"}'

