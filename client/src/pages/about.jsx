import React from "react";
import {
  BookOpen,
  Code,
  Server,
  Users,
  Smartphone,
  Layers,
  GitBranch,
  CheckCircle,
} from "lucide-react";

function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About Country Explorer
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A React application developed for SE3040 - Application Frameworks
          assignment, showcasing REST API integration and modern frontend
          development practices.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <BookOpen className="mr-2 text-purple-600" /> Assignment Overview
        </h2>

        <div className="space-y-4 text-gray-700">
          <p>
            This application was developed as part of the{" "}
            <strong>BSc (Hons) in Information Technology</strong> program at
            SLIIT, specializing in Software Engineering. The assignment focuses
            on building a React frontend application that consumes data from the
            REST Countries API.
          </p>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-medium text-purple-800 mb-2">
              Assignment Objectives:
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Develop a React application using functional components</li>
              <li>Integrate and utilize data from REST Countries API</li>
              <li>
                Enhance usability with a modern CSS framework (Tailwind CSS)
              </li>
              <li>Implement user session management</li>
              <li>Maintain robust version control with Git</li>
              <li>Deploy the application on a hosting platform</li>
              <li>Perform comprehensive testing</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Technical Implementation */}
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <Code className="mr-2 text-blue-600" /> Technical Implementation
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Technology Stack
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Frontend:</strong> React with functional components
                    and hooks
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>CSS Framework:</strong> Tailwind CSS for responsive
                    design
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>State Management:</strong> React Context API
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                API Integration
              </h3>
              <p className="text-gray-700 mb-2">
                The application uses multiple endpoints from REST Countries API:
              </p>
              <ul className="space-y-2 pl-5">
                <li className="flex items-start">
                  <Server className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    /all
                  </code>{" "}
                  - Get all countries
                </li>
                <li className="flex items-start">
                  <Server className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    /name/{"{name}"}
                  </code>{" "}
                  - Search by country name
                </li>
                <li className="flex items-start">
                  <Server className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    /region/{"{region}"}
                  </code>{" "}
                  - Filter by region
                </li>
                <li className="flex items-start">
                  <Server className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    /alpha/{"{code}"}
                  </code>{" "}
                  - Get details by country code
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <Layers className="mr-2 text-orange-600" /> Application Features
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Core Functionality
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Browse all countries with key information (name, flag,
                    population, region, capital)
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Search countries by name with dynamic results</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Filter countries by region and language</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>View detailed country information</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Additional Features
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Responsive design for all device sizes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>User authentication and session management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Dark/light mode toggle</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <GitBranch className="mr-2 text-gray-600" /> Development Process
        </h2>

        <div className="space-y-4 text-gray-700">
          <p>
            The application was developed following modern React best practices
            with regular Git commits to maintain version control. The project
            includes comprehensive testing using Jest and React Testing Library.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <Smartphone className="h-5 w-5 text-green-500 mr-2" />{" "}
                Deployment
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Hosted on Vercel (free tier)</li>
                <li>Continuous deployment from GitHub</li>
                <li>Optimized production build</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
