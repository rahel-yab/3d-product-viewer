# Interactive 3D Product Viewer

A modern, interactive 3D product viewer built with Three.js that allows users to explore a detailed chair model with real-time interactions, camera animations, and part information display.

![3D Product Viewer](https://img.shields.io/badge/Three.js-0.160.0-000000?style=for-the-badge&logo=three.js)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript)

## 🎯 Features

### Core Functionality

- **Interactive 3D Chair Model**: Detailed chair built entirely from basic Three.js geometries
- **Real-time Camera Controls**: Orbit, pan, and zoom with smooth animations
- **Part Interaction**: Click and hover on individual chair parts for detailed information
- **Auto-rotation**: Smooth automatic camera rotation around the product
- **Responsive Design**: Works seamlessly across different screen sizes

### Visual Effects

- **Advanced Lighting**: Multiple light sources with shadows and dynamic effects
- **Material Feedback**: Color changes and scale animations on interaction
- **Smooth Animations**: Floating chair animation and background elements
- **Professional UI**: Modern interface with loading screens and information panels

### Technical Features

- **Modular Architecture**: Well-organized code structure with separate modules
- **Performance Optimized**: Efficient rendering with proper shadow mapping
- **Error Handling**: Comprehensive error handling and user feedback
- **Cross-browser Compatible**: Works on all modern browsers

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd 3d-product-viewer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3001` (or the URL shown in your terminal)

## 🎮 How to Use

### Basic Controls

- **Left Click + Drag**: Rotate the camera around the chair
- **Right Click + Drag**: Pan the view
- **Scroll Wheel**: Zoom in/out
- **Click on Parts**: Select chair parts to see detailed information

### UI Controls

- **Auto Rotate Button**: Toggle automatic camera rotation on/off
- **Reset View Button**: Return to the initial camera position
- **Part Information Panel**: Shows details about selected chair parts

### Interactive Elements

- **Hover Effects**: Parts highlight when you hover over them
- **Selection Feedback**: Clicked parts show additional visual feedback
- **Information Display**: Detailed descriptions for each chair component

## 🏗️ Project Structure

```
3d-product-viewer/
├── src/
│   ├── three/
│   │   ├── initScene.js          # Scene setup and configuration
│   │   ├── createProduct.js      # Chair model creation
│   │   ├── addLighting.js        # Lighting setup and effects
│   │   ├── interaction.js        # Mouse interaction handling
│   │   └── cameraAnimation.js    # Camera animation controls
│   ├── main.js                   # Main application entry point
│   └── style.css                 # Custom styles
├── index.html                    # Main HTML file
├── package.json                  # Project dependencies
├── vite.config.js               # Vite configuration
└── README.md                    # This file
```

## 🛠️ Technical Details

### Technologies Used

- **Three.js 0.160.0**: 3D graphics library
- **Vite 5.4.2**: Build tool and development server
- **ES6 Modules**: Modern JavaScript module system

### Key Components

#### Scene Setup (`initScene.js`)

- Perspective camera configuration
- WebGL renderer with shadow mapping
- Orbit controls for user interaction
- Responsive canvas sizing

#### Product Creation (`createProduct.js`)

- Chair built from basic geometries:
  - Seat and backrest (BoxGeometry)
  - Legs and supports (CylinderGeometry)
  - Decorative elements (SphereGeometry)
- MeshStandardMaterial for realistic lighting
- Proper shadow casting and receiving

#### Lighting System (`addLighting.js`)

- Ambient light for base illumination
- Directional lights for main lighting and shadows
- Spot light for focused highlights
- Dynamic lighting effects and animations

#### Interaction System (`interaction.js`)

- Raycasting for part selection
- Hover and click feedback
- Material and scale animations
- Part information display

#### Camera Animation (`cameraAnimation.js`)

- Smooth orbital rotation
- User interaction override
- Configurable rotation speed and radius
- Position synchronization

## 🎨 Customization

### Changing Colors

Edit the material colors in `src/three/createProduct.js`:

```javascript
const materials = {
  seat: new THREE.MeshStandardMaterial({
    color: 0x800080, // Change this hex value
    // ... other properties
  }),
  // ... other materials
};
```

### Adjusting Camera Speed

Modify the rotation speed in `src/three/cameraAnimation.js`:

```javascript
this.rotationSpeed = 0.5; // Adjust this value
```

### Adding New Parts

Add new geometries to the chair in `src/three/createProduct.js`:

```javascript
const newPartGeometry = new THREE.BoxGeometry(1, 1, 1);
const newPartMesh = new THREE.Mesh(newPartGeometry, materials.seat);
// ... position and add to scene
```

## 📦 Build for Production

### Create Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🐛 Troubleshooting

### Common Issues

**"e is not defined" Error**

- This was a syntax error that has been fixed in the current version
- If you encounter this, ensure you're using the latest code

**Performance Issues**

- Reduce shadow map size in `addLighting.js`
- Lower the pixel ratio in `initScene.js`
- Disable some background animations

**Display Issues**

- Ensure your browser supports WebGL
- Check that hardware acceleration is enabled
- Try updating your graphics drivers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community**: For the amazing 3D graphics library
- **Vite Team**: For the fast build tool
- **Three.js Examples**: For inspiration and reference implementations

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information about your problem

---

**Built with ❤️ using Three.js and Vite**
