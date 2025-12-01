import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Leaf, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function LoginPage() {
  const { login, register, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [regStep, setRegStep] = useState<number>(1);

  // --- LOGIN STATE ---
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: ""
  });

  // --- REGISTER STATE ---
  const [registerData, setRegisterData] = useState<any>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", // 'DOCTOR' | 'PATIENT'
    // Patient Fields
    age: "",
    gender: "",
    // Doctor Fields
    specialization: "",
    licenseNumber: "",
    experience: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    // Clear previous auth errors when component mounts
    clearError?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- HANDLERS ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password || !loginData.role) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      setIsLoading(true);
      clearError?.();
      await login(loginData);
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(error?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.role) {
      toast.error("Please fill in all basic fields");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setRegStep(2);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const basePayload: any = {
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      role: registerData.role
    };

    if (registerData.role === "DOCTOR") {
      if (!registerData.specialization || !registerData.licenseNumber || !registerData.experience) {
        toast.error("Please fill all doctor details");
        return;
      }
      basePayload.specialization = registerData.specialization;
      basePayload.licenseNumber = registerData.licenseNumber;
      basePayload.experience = Number(registerData.experience);
      if (registerData.phone) basePayload.phone = registerData.phone;
      if (registerData.address) basePayload.address = registerData.address;
    } else if (registerData.role === "PATIENT") {
      if (!registerData.age || !registerData.gender) {
        toast.error("Please fill all patient details");
        return;
      }
      basePayload.age = Number(registerData.age);
      basePayload.gender = registerData.gender;
      if (registerData.phone) basePayload.phone = registerData.phone;
      if (registerData.address) basePayload.address = registerData.address;
    }

    try {
      setIsLoading(true);
      clearError?.();
      await register(basePayload);
      toast.success("Registration successful!");
      // Optionally reset the form and return to login
      setRegStep(1);
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        age: "",
        gender: "",
        specialization: "",
        licenseNumber: "",
        experience: "",
        phone: "",
        address: ""
      });
    } catch (error: any) {
      toast.error(error?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // --- OAuth login (Cognito Hosted UI) ---
  const handleOAuthLogin = () => {
    // Use relative path so Vite proxy forwards to backend
    window.location.href = "/api/auth/oauth/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 transform rotate-12">
          <Leaf className="w-32 h-32 text-primary" />
        </div>
        <div className="absolute bottom-20 right-20 transform -rotate-12">
          <Sparkles className="w-24 h-24 text-accent" />
        </div>
      </div>

      <Card
        className={`w-full shadow-2xl border-0 backdrop-blur-sm bg-white/90 transition-all duration-500 ease-in-out ${
          regStep === 2 ? "max-w-2xl" : "max-w-md"
        }`}
      >
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl text-primary">Ayurcare</CardTitle>
            <CardDescription className="text-muted-foreground">
              {regStep === 2
                ? `Complete your ${String(registerData.role || "").toLowerCase()} profile`
                : "Ancient Root, Smart Tech, Kare Connect"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {/* OAuth button - prominent */}
          <div className="mb-4 flex justify-center">
            <Button
              onClick={handleOAuthLogin}
              className="bg-white border shadow-sm hover:shadow-md"
              variant="outline"
            >
              <span className="mr-2">Sign in with Cognito</span>
              <Leaf className="w-4 h-4" />
            </Button>
          </div>

          <Tabs defaultValue="login" className="w-full" onValueChange={() => setRegStep(1)}>
            {regStep === 1 && (
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            )}

            {/* --- LOGIN CONTENT --- */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    className="border border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="border border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={loginData.role}
                    onValueChange={(value) => setLoginData({ ...loginData, role: value })}
                    className="border border-gray-300"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DOCTOR">Doctor</SelectItem>
                      <SelectItem value="PATIENT">Patient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            {/* --- REGISTER CONTENT --- */}
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit}>
                {/* STEP 1: BASIC INFO */}
                {regStep === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                        className="border border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                        className="border border-gray-300"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input
                          type="password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          required
                          className="border border-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Confirm</Label>
                        <Input
                          type="password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          required
                          className="border border-gray-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Registering As</Label>
                      <Select
                        value={registerData.role}
                        onValueChange={(value) => setRegisterData({ ...registerData, role: value })}
                        className="border border-gray-300"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PATIENT">Patient (Seek Diet Plan)</SelectItem>
                          <SelectItem value="DOCTOR">Doctor (Provide Consultation)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="button" onClick={handleNextStep} className="w-full mt-4">
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* STEP 2: ROLE SPECIFIC DETAILS */}
                {regStep === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* DOCTOR FIELDS */}
                    {registerData.role === "DOCTOR" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Specialization</Label>
                          <Input
                            placeholder="e.g. Ayurvedic Medicine"
                            value={registerData.specialization}
                            onChange={(e) => setRegisterData({ ...registerData, specialization: e.target.value })}
                            className="border border-gray-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>License Number</Label>
                          <Input
                            placeholder="Medical License ID"
                            value={registerData.licenseNumber}
                            onChange={(e) => setRegisterData({ ...registerData, licenseNumber: e.target.value })}
                            className="border border-gray-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Years of Experience</Label>
                          <Input
                            type="number"
                            value={registerData.experience}
                            onChange={(e) => setRegisterData({ ...registerData, experience: e.target.value })}
                            className="border border-gray-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Phone Number</Label>
                          <Input
                            type="tel"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                            className="border border-gray-300"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>Clinic Address</Label>
                          <Input
                            value={registerData.address}
                            onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                            className="border border-gray-300"
                          />
                        </div>
                      </div>
                    )}

                    {/* PATIENT FIELDS */}
                    {registerData.role === "PATIENT" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Age</Label>
                          <Input
                            type="number"
                            value={registerData.age}
                            onChange={(e) => setRegisterData({ ...registerData, age: e.target.value })}
                            className="border border-gray-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <Select
                            value={registerData.gender}
                            onValueChange={(value) => setRegisterData({ ...registerData, gender: value })}
                            className="border border-gray-300"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Phone Number (Optional)</Label>
                          <Input
                            type="tel"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                            className="border border-gray-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Address (Optional)</Label>
                          <Input
                            type="text"
                            value={registerData.address}
                            onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                            className="border border-gray-300"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setRegStep(1)} className="w-1/3">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button type="submit" className="w-2/3 bg-primary hover:bg-primary/90" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Complete Registration"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}