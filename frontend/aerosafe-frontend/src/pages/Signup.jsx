import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const [role, setRole] = useState("pilot"); // pilot | admin

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f5f7fb]">
      <Card className="w-[380px] border border-gray-300 shadow-[8px_10px_25px_rgba(84,110,255,0.3)]">
        
        <CardHeader className="text-center">
          <img 
            src="/logo.png" 
            alt="AeroSafe" 
            className="w-24 mx-auto mb-2"
          />
          <CardTitle className="text-xl font-semibold text-[#3B5FCC]">
            AeroSafe Sign-Up
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Role Selection (Admin / Pilot) */}
          <div className="flex gap-3 justify-center mb-4">
            <Button 
              variant={role === "admin" ? "default" : "outline"}
              className="w-32"
              onClick={() => setRole("admin")}
            >
              Admin
            </Button>

            <Button 
              variant={role === "pilot" ? "default" : "outline"}
              className="w-32"
              onClick={() => setRole("pilot")}
            >
              Pilot
            </Button>
          </div>

          <div className="space-y-1">
            <Label>Name</Label>
            <Input placeholder="Enter your name" />
          </div>

          <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" placeholder="Enter your email" />
          </div>

          {role === "pilot" && (
            <div className="space-y-1">
              <Label>Pilot ID</Label>
              <Input placeholder="Enter Pilot ID" />
            </div>
          )}

          {/* PASSWORD */}
          <div className="space-y-1 relative">
            <Label>Password</Label>
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Enter password"
            />
            <span 
              className="absolute right-3 bottom-2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="space-y-1 relative">
            <Label>Confirm Password</Label>
            <Input 
              type={showCPassword ? "text" : "password"} 
              placeholder="Confirm password"
            />
            <span 
              className="absolute right-3 bottom-2 cursor-pointer text-gray-600"
              onClick={() => setShowCPassword(!showCPassword)}
            >
              {showCPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
            </span>
          </div>

          <Button className="w-full bg-[#3B5FCC] hover:bg-[#2f4db3]">
            Sign Up
          </Button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <a href="/login" className="text-[#3B5FCC] font-medium">
              Login
            </a>
          </p>

          <div className="text-center">
            <a href="/forgot-password" className="text-sm text-[#3B5FCC]">
              Forgot Password?
            </a>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
