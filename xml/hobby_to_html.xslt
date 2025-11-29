<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:text>Hobby Profile</xsl:text></title>
      </head>
      <body>
        <h1><xsl:value-of select="hobbyProfile/personal/name"/></h1>
        <h2>Overview</h2>
        <p><xsl:value-of select="hobbyProfile/philosophyOverview/@summary"/></p>
        <h3>Branches</h3>
        <ul>
          <xsl:for-each select="hobbyProfile/philosophyOverview/branches/branch">
            <li><xsl:value-of select="@type"/>: <xsl:value-of select="description"/></li>
          </xsl:for-each>
        </ul>
        <h3>Gallery</h3>
        <ul>
          <xsl:for-each select="hobbyProfile/philosophyOverview/gallery/photo">
            <li><xsl:value-of select="@filename"/> - <xsl:value-of select="@caption"/></li>
          </xsl:for-each>
        </ul>
        <h3>External links</h3>
        <ul>
          <xsl:for-each select="hobbyProfile/philosophyOverview/externalLinks/link">
            <li><a href="{.}"><xsl:value-of select="."/></a></li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
