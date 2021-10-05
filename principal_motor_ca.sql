-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-07-2021 a las 16:47:18
-- Versión del servidor: 10.4.19-MariaDB
-- Versión de PHP: 7.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `principal_motor_ca`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bitacora`
--

CREATE TABLE `bitacora` (
  `id_bitacora` int(32) NOT NULL,
  `usuario_id` int(32) NOT NULL DEFAULT 0,
  `bitacora` varchar(255) NOT NULL,
  `tipo_bitacora` enum('registro','actualizacion') DEFAULT NULL,
  `modulo` enum('ventas','configuracion','inventario','compras') DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `id_compra` int(32) NOT NULL,
  `producto_id` int(32) NOT NULL,
  `cantidad_comprada` int(32) NOT NULL,
  `tipo_pago` enum('dolares','pago_movil','transferencia','punto') NOT NULL,
  `precio_usd` mediumtext NOT NULL,
  `precio_bs` mediumtext NOT NULL,
  `fecha_creacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `deudores`
--

CREATE TABLE `deudores` (
  `id_deudor` int(30) NOT NULL,
  `usuario_id` int(30) NOT NULL,
  `descripcion` text NOT NULL,
  `deuda_bs` text DEFAULT NULL,
  `deuda_usd` text DEFAULT NULL,
  `estado_id` int(30) DEFAULT 1,
  `fecha_registro` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `distribuidor`
--

CREATE TABLE `distribuidor` (
  `id_distribuidor` int(32) NOT NULL,
  `distribuidor` varchar(255) NOT NULL,
  `estado_id` int(32) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `id_estado` int(32) NOT NULL,
  `estado` varchar(255) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `estado`
--

INSERT INTO `estado` (`id_estado`, `estado`, `fecha_creacion`, `fecha_modificacion`) VALUES
(1, 'activo', '2021-04-22 08:24:44', NULL),
(2, 'inactivo', '2021-04-22 08:24:51', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `id_factura` int(32) NOT NULL,
  `id_referencial` varchar(255) NOT NULL DEFAULT '0',
  `total_bs` text NOT NULL,
  `total_usd` text NOT NULL,
  `estado_id` int(32) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `impuesto`
--

CREATE TABLE `impuesto` (
  `id_impuesto` int(32) NOT NULL,
  `impuesto` varchar(255) NOT NULL,
  `porcentaje` float NOT NULL DEFAULT 0,
  `estado_id` int(32) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id_inventario` int(32) NOT NULL,
  `nombre_producto` varchar(255) NOT NULL DEFAULT '0',
  `tipo_producto_id` int(32) NOT NULL,
  `marca_id` int(32) NOT NULL,
  `estado_id` int(32) NOT NULL,
  `cantidad` double NOT NULL,
  `precio_usd` text DEFAULT NULL,
  `precio_bs` text DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `id_marca` int(32) NOT NULL,
  `marca` varchar(255) NOT NULL,
  `distribuidor_id` int(32) NOT NULL,
  `estado_id` int(32) NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(30) NOT NULL,
  `rol` varchar(255) NOT NULL,
  `fecha_registro` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `rol`, `fecha_registro`) VALUES
(1, 'Administrador', '2021-07-05 09:12:30'),
(3, 'Cajero', '2021-07-13 21:09:14'),
(4, 'Limpieza', '0000-00-00 00:00:00'),
(5, 'Gerente', '2021-07-13 21:09:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_producto`
--

CREATE TABLE `tipo_producto` (
  `id_tipo_producto` int(32) NOT NULL,
  `tipo_producto` varchar(255) NOT NULL,
  `estado_id` int(32) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime NOT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(32) NOT NULL,
  `rol_id` int(30) NOT NULL,
  `estado_id` int(30) NOT NULL DEFAULT 1,
  `usuario` varchar(255) NOT NULL,
  `tipo_usuario` enum('admin','empleado','cliente','organizacion') NOT NULL,
  `numero_identificacion` varchar(50) NOT NULL,
  `tipo_identificacion` enum('V','E','J','P','G') NOT NULL DEFAULT 'V',
  `salario_bs` varchar(255) NOT NULL DEFAULT 'V',
  `salario_usd` varchar(255) NOT NULL DEFAULT 'V',
  `fecha_creacion` datetime NOT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` int(32) NOT NULL,
  `productos` mediumtext NOT NULL,
  `factura_id` int(32) NOT NULL,
  `impuestos` text NOT NULL,
  `estado_id` int(32) NOT NULL,
  `tipo_pago` enum('dolares','pago_movil','transferencia','punto') NOT NULL,
  `fecha_creacion` date NOT NULL,
  `fecha_modificacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bitacora`
--
ALTER TABLE `bitacora`
  ADD PRIMARY KEY (`id_bitacora`) USING BTREE,
  ADD KEY `usuario_id` (`usuario_id`) USING BTREE;

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`id_compra`) USING BTREE,
  ADD KEY `producto_id` (`producto_id`) USING BTREE;

--
-- Indices de la tabla `deudores`
--
ALTER TABLE `deudores`
  ADD PRIMARY KEY (`id_deudor`) USING BTREE;

--
-- Indices de la tabla `distribuidor`
--
ALTER TABLE `distribuidor`
  ADD PRIMARY KEY (`id_distribuidor`),
  ADD KEY `estado_id` (`estado_id`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`id_estado`);

--
-- Indices de la tabla `factura`
--
ALTER TABLE `factura`
  ADD PRIMARY KEY (`id_factura`),
  ADD KEY `estado_id` (`estado_id`);

--
-- Indices de la tabla `impuesto`
--
ALTER TABLE `impuesto`
  ADD PRIMARY KEY (`id_impuesto`),
  ADD KEY `estado_id` (`estado_id`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_inventario`),
  ADD KEY `tipo_producto_id` (`tipo_producto_id`),
  ADD KEY `marca_id` (`marca_id`),
  ADD KEY `estado_id` (`estado_id`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`id_marca`),
  ADD KEY `distribuidor_id` (`distribuidor_id`),
  ADD KEY `estado_id` (`estado_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `tipo_producto`
--
ALTER TABLE `tipo_producto`
  ADD PRIMARY KEY (`id_tipo_producto`),
  ADD KEY `estado_id` (`estado_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `rol_id` (`rol_id`),
  ADD KEY `estado_id` (`estado_id`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id_venta`) USING BTREE,
  ADD KEY `estado_id` (`estado_id`) USING BTREE,
  ADD KEY `factura_id` (`factura_id`) USING BTREE;

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bitacora`
--
ALTER TABLE `bitacora`
  MODIFY `id_bitacora` int(32) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `id_compra` int(32) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `deudores`
--
ALTER TABLE `deudores`
  MODIFY `id_deudor` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `distribuidor`
--
ALTER TABLE `distribuidor`
  MODIFY `id_distribuidor` int(32) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `id_estado` int(32) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id_factura` int(32) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `impuesto`
--
ALTER TABLE `impuesto`
  MODIFY `id_impuesto` int(32) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inventario` int(32) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id_marca` int(32) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tipo_producto`
--
ALTER TABLE `tipo_producto`
  MODIFY `id_tipo_producto` int(32) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(32) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int(32) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `inventario` (`id_inventario`);

--
-- Filtros para la tabla `distribuidor`
--
ALTER TABLE `distribuidor`
  ADD CONSTRAINT `distribuidor_ibfk_1` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id_estado`);

--
-- Filtros para la tabla `factura`
--
ALTER TABLE `factura`
  ADD CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id_estado`);

--
-- Filtros para la tabla `impuesto`
--
ALTER TABLE `impuesto`
  ADD CONSTRAINT `impuesto_ibfk_1` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id_estado`);

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`tipo_producto_id`) REFERENCES `tipo_producto` (`id_tipo_producto`),
  ADD CONSTRAINT `inventario_ibfk_2` FOREIGN KEY (`marca_id`) REFERENCES `marca` (`id_marca`),
  ADD CONSTRAINT `inventario_ibfk_3` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id_estado`);

--
-- Filtros para la tabla `marca`
--
ALTER TABLE `marca`
  ADD CONSTRAINT `marca_ibfk_1` FOREIGN KEY (`distribuidor_id`) REFERENCES `distribuidor` (`id_distribuidor`),
  ADD CONSTRAINT `marca_ibfk_2` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id_estado`);

--
-- Filtros para la tabla `tipo_producto`
--
ALTER TABLE `tipo_producto`
  ADD CONSTRAINT `tipo_producto_ibfk_1` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id_estado`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id_rol`),
  ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id_estado`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id_estado`),
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`factura_id`) REFERENCES `factura` (`id_factura`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
