import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  DashboardOutlined,
  WhatsAppOutlined,
  CarOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { Shield, Building2, Gauge } from 'lucide-react';
import { useAppDispatch } from '../../redux/hooks';
import { switchRole, type UserRole } from '../../redux/slices/authSlice';
import { FuelCastLogo } from '../../components/FuelCastLogo';
import { FuelStationIllustration } from './FuelStationIllustration';
import styles from './login.module.css';

interface LoginFormValues {
  accountIdentifier: string;
  accessKeyToken: string;
}

const DEFAULT_CREDENTIALS: Record<UserRole, { email: string; label: string }> = {
  ADMIN: {
    email: 'admin@fuelcast.in',
    label: 'Platform Administrator (Aditya Reddy)',
  },
  DISTRIBUTOR: {
    email: 'distributor@krishnafuels.in',
    label: 'Regional Distributor (Anil Varma)',
  },
  DEALER: {
    email: 'dealer@sharmafuels.in',
    label: 'Station Owner (Ramesh Sharma)',
  },
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<LoginFormValues>();
  const [selectedRole, setSelectedRole] = useState<UserRole>('DEALER');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    form.setFieldsValue({
      accountIdentifier: DEFAULT_CREDENTIALS[role].email,
      accessKeyToken: '••••••••••',
    });
  };

  const onFinish = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const input = (values.accountIdentifier || '').toLowerCase();

      // Resolve role from email or selected role
      let roleToLogin: UserRole = selectedRole;
      if (input.includes('admin')) {
        roleToLogin = 'ADMIN';
      } else if (input.includes('dist') || input.includes('krishna') || input.includes('anil')) {
        roleToLogin = 'DISTRIBUTOR';
      } else if (input.includes('dealer') || input.includes('sharma') || input.includes('ramesh')) {
        roleToLogin = 'DEALER';
      }

      dispatch(switchRole(roleToLogin));

      if (roleToLogin === 'ADMIN') {
        message.success('Welcome Aditya Reddy! Entering Platform Administrator Portal.');
        navigate('/admin/dashboard');
      } else if (roleToLogin === 'DEALER') {
        message.success('Welcome Ramesh Sharma! Entering Station Owner Portal.');
        navigate('/dealer/dashboard');
      } else {
        message.success('Welcome Anil Varma! Entering Regional Distributor Portal.');
        navigate('/distributor/dashboard');
      }
    } catch {
      message.error('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      {/* Ambient background glows */}
      <div className={styles.background}>
        <div className={styles.bgBlob1} />
        <div className={styles.bgBlob2} />
      </div>

      {/* Main split grid */}
      <div className={styles.loginContent}>
        <div className={styles.loginLeftSection}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <FuelCastLogo size="md" showTagline={true} textColor="#FFFFFF" />
          </div>

          {/* Headline */}
          <h1 className={styles.mainHeading}>
            Never run dry again.<br />
            <span className={styles.titleAccent}>Refill on time.</span>
          </h1>

          {/* Subheading */}
          <p className={styles.subHeading}>
            FuelCast reads two stock readings a day, learns each pump&apos;s sales pattern
            and warns you days before a tank runs low.
          </p>

          {/* Sleek Value-Prop Bullets */}
          <ul className={styles.bulletList}>
            <li className={styles.bulletItem}>
              <span className={`${styles.bulletIcon} ${styles.iconBlue}`}>
                <DashboardOutlined />
              </span>
              <span className={styles.bulletText}>Days left for every tank, updated every night</span>
            </li>
            <li className={styles.bulletItem}>
              <span className={`${styles.bulletIcon} ${styles.iconGreen}`}>
                <WhatsAppOutlined />
              </span>
              <span className={styles.bulletText}>WhatsApp alerts to station owners and distributors</span>
            </li>
            <li className={styles.bulletItem}>
              <span className={`${styles.bulletIcon} ${styles.iconCyan}`}>
                <CarOutlined />
              </span>
              <span className={styles.bulletText}>Refill orders created and tracked for you</span>
            </li>
          </ul>

          {/* Fuel Station Telemetry Illustration & Status Chips */}
          <div className={styles.stationContainer}>
            <FuelStationIllustration />
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: ELEVATED SIGN IN CARD                       */}
        {/* ========================================================= */}
        <div className={styles.loginRightSection}>
          <Card className={styles.loginCard} bordered={false}>
            <h2 className={styles.welcomeTitle}>Sign In to FuelCast</h2>
            <p className={styles.welcomeSubtitle}>Select your access portal to continue</p>

            {/* Portal Role Selector */}
            <div className={styles.roleSelectorGroup}>
              <button
                type="button"
                className={`${styles.roleSelectorBtn} ${selectedRole === 'DEALER' ? styles.roleSelectorActive : ''}`}
                onClick={() => handleRoleSelect('DEALER')}
              >
                <Gauge size={13} />
                <span>Station Owner</span>
              </button>
              <button
                type="button"
                className={`${styles.roleSelectorBtn} ${selectedRole === 'DISTRIBUTOR' ? styles.roleSelectorActive : ''}`}
                onClick={() => handleRoleSelect('DISTRIBUTOR')}
              >
                <Building2 size={13} />
                <span>Distributor</span>
              </button>
              <button
                type="button"
                className={`${styles.roleSelectorBtn} ${selectedRole === 'ADMIN' ? styles.roleSelectorActive : ''}`}
                onClick={() => handleRoleSelect('ADMIN')}
              >
                <Shield size={13} />
                <span>Admin</span>
              </button>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              autoComplete="off"
              initialValues={{
                accountIdentifier: DEFAULT_CREDENTIALS.DEALER.email,
                accessKeyToken: '••••••••••',
              }}
            >
              {/* Email / Username field */}
              <Form.Item
                label={
                  <span className={styles.fieldLabel}>
                    <span className={styles.requiredStar}>*</span> Email / Account ID
                  </span>
                }
                name="accountIdentifier"
                rules={[{ required: true, message: 'Please enter Email / Account ID' }]}
              >
                <Input
                  prefix={<UserOutlined className={styles.inputIcon} />}
                  placeholder="name@fuelcast.in"
                  className={styles.customInput}
                  autoComplete="off"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                />
              </Form.Item>

              {/* Password field */}
              <Form.Item
                label={
                  <span className={styles.fieldLabel}>
                    <span className={styles.requiredStar}>*</span> Password
                  </span>
                }
                name="accessKeyToken"
                rules={[{ required: true, message: 'Please enter password' }]}
              >
                <Input
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="••••••••••"
                  className={`${styles.customInput} ${showPassword ? styles.unmaskedPassword : styles.maskedPassword}`}
                  autoComplete="new-password"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  suffix={
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </span>
                  }
                />
              </Form.Item>

              {/* Right-aligned Forgot Password Link */}
              <div className={styles.forgotWrapper}>
                <a
                  href="#forgot"
                  className={styles.forgotLink}
                  onClick={(e) => {
                    e.preventDefault();
                    message.info('Password reset instructions sent to your registered WhatsApp.');
                  }}
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.loginFormButton}
                  loading={isLoading}
                  block
                >
                  <span>Log In to {selectedRole === 'ADMIN' ? 'Admin Portal' : selectedRole === 'DEALER' ? 'Owner Portal' : 'Distributor Portal'}</span>
                  <ArrowRightOutlined style={{ fontSize: 13, marginLeft: 6 }} />
                </Button>
              </Form.Item>
            </Form>

            {/* Security Footer */}
            <div className={styles.securityFooter}>
              <SafetyCertificateOutlined className={styles.securityIcon} />
              <span>Enterprise RBAC Active • 256-bit TLS</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
